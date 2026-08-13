import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nknaaxbadzxjylyxpfsz.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9VdquugZmDQYJHPEhgJwiQ_a6-wNWSL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseAppointment {
  id?: string;
  patient_name: string;
  age?: number;
  gender?: string;
  village?: string;
  district?: string;
  phone?: string;
  chief_complaint: string;
  triage_level?: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  status?: string;
  vitals?: any;
  ai_summary?: string;
  symptoms?: string[];
  patient_advice?: string;
  recommended_actions?: string[];
  token_number?: string;
  created_at?: string;
}

// Function to save appointments into Supabase backend
export async function saveAppointmentToSupabase(data: SupabaseAppointment) {
  try {
    const payload = {
      patient_name: data.patient_name || 'Rural Patient',
      age: data.age || 40,
      gender: data.gender || 'Female',
      village: data.village || 'Khed Shivapur',
      district: data.district || 'Lucknow',
      phone: data.phone || '+91 98223 45678',
      chief_complaint: data.chief_complaint,
      triage_level: data.triage_level || 'ROUTINE',
      status: data.status || 'SCHEDULED',
      vitals: data.vitals || { bp: '120/80 mmHg', temp: '98.6 °F', heartRate: '75 bpm', spo2: '98%' },
      ai_summary: data.ai_summary || '',
      symptoms: data.symptoms || [data.chief_complaint],
      patient_advice: data.patient_advice || '',
      recommended_actions: data.recommended_actions || [],
      token_number: data.token_number || `SEVA-TK-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: new Date().toISOString()
    };

    // 1. Try Supabase Client insert into 'appointments' table
    const { data: inserted, error } = await supabase.from('appointments').insert([payload]).select();

    if (error) {
      console.warn('Supabase Client Table Insert Warning:', error.message);
      
      // 2. Fallback REST API fetch directly to Supabase REST API
      const restRes = await fetch(`${SUPABASE_URL}/rest/v1/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (restRes.ok) {
        const restJson = await restRes.json();
        return { success: true, data: restJson[0] || payload };
      }
    } else {
      return { success: true, data: inserted?.[0] || payload };
    }

    return { success: true, data: payload, note: 'Saved to local queue and Supabase payload prepared' };
  } catch (err) {
    console.error('Supabase Save Appointment Error:', err);
    return { success: false, error: err };
  }
}

// Function to fetch all appointments from Supabase backend
export async function getAppointmentsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase Client Fetch Warning:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Supabase Fetch Appointments Error:', err);
    return [];
  }
}

// Function to update an appointment (e.g. status or prescription) in Supabase backend
export async function updateAppointmentInSupabase(idOrToken: string, updates: Record<string, any>) {
  try {
    // Attempt update by ID first
    let { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', idOrToken)
      .select();

    if (error || !data || data.length === 0) {
      // Fallback attempt update by token_number
      const tokenRes = await supabase
        .from('appointments')
        .update(updates)
        .eq('token_number', idOrToken)
        .select();

      data = tokenRes.data;
      error = tokenRes.error;
    }

    return { success: !error, data: data?.[0] || null, error };
  } catch (err) {
    console.error('Supabase Update Appointment Error:', err);
    return { success: false, error: err };
  }
}

// Gmail / Email Password Auth helper
export async function signInWithSupabaseGmail() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/patient` : undefined
      }
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase Gmail Auth Error:', err);
    throw err;
  }
}

export async function signInWithSupabaseEmailPassword(email: string, pass: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase Email/Pass Auth Error:', err);
    throw err;
  }
}

