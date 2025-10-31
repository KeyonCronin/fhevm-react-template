/**
 * Keys API Route
 * Handles public key management
 */

import { NextRequest, NextResponse } from 'next/server';
import { isValidAddress } from '../../../lib/utils/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractAddress = searchParams.get('contract');

    if (!contractAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contract address is required',
        },
        { status: 400 }
      );
    }

    if (!isValidAddress(contractAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid contract address',
        },
        { status: 400 }
      );
    }

    // In a real implementation, fetch the public key from the contract or database
    // For this example, we return a mock public key
    const mockPublicKey = `0x${Math.random().toString(16).substring(2)}`;

    return NextResponse.json({
      success: true,
      data: {
        contractAddress,
        publicKey: mockPublicKey,
        algorithm: 'TFHE',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch key',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractAddress, publicKey } = body;

    if (!isValidAddress(contractAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid contract address',
        },
        { status: 400 }
      );
    }

    if (!publicKey || typeof publicKey !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid public key',
        },
        { status: 400 }
      );
    }

    // In a real implementation, store the public key
    // For this example, we just return success
    return NextResponse.json({
      success: true,
      message: 'Public key stored successfully',
      data: {
        contractAddress,
        publicKey,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to store key',
      },
      { status: 500 }
    );
  }
}
