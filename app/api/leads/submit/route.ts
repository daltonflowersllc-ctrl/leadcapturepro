import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      callerName, 
      callerPhone, 
      callerEmail, 
      serviceNeeded, 
      urgency,
      formData 
    } = await request.json();

    // Validation
    if (!userId || !callerName || !callerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO:
    // 1. Verify user exists and has Pro tier
    // 2. Check if user has reached their monthly lead limit
    // 3. Create lead record in database
    // 4. Send notification to company (SMS or email)
    // 5. Send confirmation to caller

    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
