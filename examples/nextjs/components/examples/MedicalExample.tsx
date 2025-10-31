/**
 * Medical Example Component
 * Demonstrates confidential medical data management using FHE
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '../../hooks/useEncryption';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface MedicalExampleProps {
  contractAddress: string;
  userAddress: string;
}

interface MedicalRecord {
  id: string;
  type: string;
  value: string;
  timestamp: Date;
  encrypted: boolean;
}

export default function MedicalExample({
  contractAddress,
  userAddress,
}: MedicalExampleProps) {
  const [recordType, setRecordType] = useState<'bloodPressure' | 'heartRate' | 'temperature' | 'glucose'>('bloodPressure');
  const [value, setValue] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const { encrypt, isEncrypting } = useEncryption();

  const recordLabels = {
    bloodPressure: 'Blood Pressure (mmHg)',
    heartRate: 'Heart Rate (bpm)',
    temperature: 'Temperature (°F)',
    glucose: 'Blood Glucose (mg/dL)',
  };

  const handleAddRecord = async () => {
    try {
      const numValue = parseInt(value, 10);

      // Encrypt the medical data
      const encrypted = await encrypt(numValue, 'euint16', contractAddress, userAddress);

      // Add to records
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        type: recordLabels[recordType],
        value: value,
        timestamp: new Date(),
        encrypted: true,
      };

      setRecords([newRecord, ...records]);
      setValue('');
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  const getRecordIcon = (type: string) => {
    if (type.includes('Blood Pressure')) return '🩺';
    if (type.includes('Heart Rate')) return '❤️';
    if (type.includes('Temperature')) return '🌡️';
    if (type.includes('Glucose')) return '🩸';
    return '📊';
  };

  return (
    <Card
      title="Confidential Medical Records"
      description="Secure medical data management with FHE encryption"
    >
      <div className="space-y-6">
        {/* Alert */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            All medical records are encrypted before storage using FHE technology,
            ensuring complete privacy and security.
          </p>
        </div>

        {/* Add Record Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Type
            </label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bloodPressure">Blood Pressure</option>
              <option value="heartRate">Heart Rate</option>
              <option value="temperature">Temperature</option>
              <option value="glucose">Blood Glucose</option>
            </select>
          </div>

          <Input
            label={recordLabels[recordType]}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            helperText="Value will be encrypted before storage"
          />

          <Button
            onClick={handleAddRecord}
            isLoading={isEncrypting}
            disabled={!value}
            variant="success"
            className="w-full"
          >
            Add Encrypted Record
          </Button>
        </div>

        {/* Medical Records */}
        {records.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Medical Records ({records.length})</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getRecordIcon(record.type)}</span>
                      <div>
                        <p className="font-medium text-gray-800">{record.type}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Value: <span className="font-mono font-bold">{record.value}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {record.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {record.encrypted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                        Encrypted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {records.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">📋</p>
            <p>No medical records yet</p>
            <p className="text-sm mt-1">Add your first encrypted medical record above</p>
          </div>
        )}

        {/* Privacy Information */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">HIPAA-Compliant Privacy</h4>
          <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
            <li>All medical data encrypted at the source</li>
            <li>Zero-knowledge computations on encrypted data</li>
            <li>Access control via smart contracts</li>
            <li>Audit trail without exposing sensitive data</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
