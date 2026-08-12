import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role = 'PATIENT', phone = '+91 98223 45678', email, method = 'MOCK' } = body;

    const mockUser = {
      id: `usr-${Date.now()}`,
      name: role === 'HEALTH_WORKER' ? 'ASHA Worker Sarita' : role === 'DOCTOR' ? 'Dr. M. Kulkarni' : 'Ramesh Patil',
      email: email || (role === 'DOCTOR' ? 'dr.kulkarni@sevahealth.org' : 'patient@sevahealth.org'),
      phone: phone,
      role: role,
      token: `token-seva-${role.toLowerCase()}-${Date.now()}`,
      lastLogin: new Date().toISOString()
    };

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: mockUser,
      redirectUrl: role === 'HEALTH_WORKER' ? '/health-worker' : role === 'DOCTOR' ? '/doctor' : '/patient'
    });

    // Set auth cookie
    response.cookies.set('seva_auth_token', mockUser.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (error) {
    console.error('Auth Login API Error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
