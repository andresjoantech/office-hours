'use client';

import { forwardRef, useState } from 'react';
import { ProfessorData } from '@/types/professor';
import QRCode from './QRCode';
import { Pencil, Check, X } from 'lucide-react';

interface SignCardProps {
  professor: ProfessorData;
  onUpdate?: (updated: ProfessorData) => void;
  showEditButton?: boolean;
}

// Helper component for editable text fields - defined outside the render function
interface EditableTextProps {
  isEditing: boolean;
  value: string;
  editValue: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  rows?: number;
}

function EditableText({
  isEditing,
  value,
  editValue,
  onChange,
  className = '',
  multiline = false,
  rows = 3,
}: EditableTextProps) {
  if (isEditing) {
    return multiline ? (
      <textarea
        value={editValue}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-yellow-50 border border-yellow-300 rounded px-2 py-1 w-full resize-none ${className}`}
        rows={rows}
      />
    ) : (
      <input
        type="text"
        value={editValue}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-yellow-50 border border-yellow-300 rounded px-2 py-1 ${className}`}
      />
    );
  }
  return <span className={className}>{value}</span>;
}

const SignCard = forwardRef<HTMLDivElement, SignCardProps>(
  ({ professor, onUpdate, showEditButton = true }, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(professor);

    const handleEdit = () => {
      setEditData(professor);
      setIsEditing(true);
    };

    const handleSave = () => {
      onUpdate?.(editData);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditData(professor);
      setIsEditing(false);
    };

    const updateField = (field: keyof ProfessorData, value: string | boolean) => {
      setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const displayData = isEditing ? editData : professor;

    return (
      <div className="relative">
        {/* Edit Controls - Only visible in edit mode or on hover */}
        {showEditButton && (
          <div className="absolute top-2 right-2 z-10 flex gap-2 print:hidden">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-md"
                  title="Save changes"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md opacity-70 hover:opacity-100"
                title="Edit sign"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
        )}

        {/* The actual sign */}
        <div
          ref={ref}
          className="sign-card bg-white border-4 border-[#081E3F] rounded-lg shadow-lg p-8 max-w-[8.5in] mx-auto"
          style={{
            width: '8.5in',
            minHeight: '11in',
            fontFamily: 'Georgia, serif',
          }}
        >
          {/* Header with Department branding */}
          <div className="text-center border-b-2 border-[#B6862C] pb-4 mb-6">
            <h1 className="text-2xl font-bold text-[#081E3F] tracking-wide">
              Department of Teaching and Learning
            </h1>
          </div>

          {/* Professor Name */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#081E3F] mb-2">
              Professor{' '}
              <EditableText
                isEditing={isEditing}
                value={displayData.firstName}
                editValue={editData.firstName}
                onChange={(v) => updateField('firstName', v)}
                className="inline"
              />{' '}
              <EditableText
                isEditing={isEditing}
                value={displayData.lastName}
                editValue={editData.lastName}
                onChange={(v) => updateField('lastName', v)}
                className="inline"
              />
            </h2>
          </div>

          {/* Office Hours Title */}
          <div className="text-center mb-8">
            <div className="inline-block bg-[#081E3F] text-white px-8 py-3 rounded-lg">
              <h3 className="text-2xl font-semibold">
                Office Hours for{' '}
                <EditableText
                  isEditing={isEditing}
                  value={displayData.semester}
                  editValue={editData.semester}
                  onChange={(v) => updateField('semester', v)}
                  className="inline"
                />
              </h3>
            </div>
          </div>

          {/* Office Hours Schedule */}
          <div className="bg-gray-50 border-2 border-[#081E3F] rounded-lg p-6 mb-8">
            <h4 className="text-xl font-bold text-[#081E3F] mb-4 text-center">Schedule</h4>
            <div className="text-center text-lg leading-relaxed whitespace-pre-wrap">
              {isEditing ? (
                <textarea
                  value={editData.officeHours}
                  onChange={(e) => updateField('officeHours', e.target.value)}
                  className="bg-yellow-50 border border-yellow-300 rounded px-2 py-1 w-full resize-none text-center"
                  rows={4}
                />
              ) : (
                <p>{displayData.officeHours}</p>
              )}
            </div>
          </div>

          {/* QR Code Section (if meeting link exists) */}
          {displayData.meetingLink && (
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Online Meeting Link</p>
                <QRCode url={displayData.meetingLink} size={140} />
                {isEditing && (
                  <input
                    type="url"
                    value={editData.meetingLink || ''}
                    onChange={(e) => updateField('meetingLink', e.target.value)}
                    placeholder="Meeting URL"
                    className="mt-2 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 text-sm w-full"
                  />
                )}
              </div>
            </div>
          )}

          {/* By Appointment Note */}
          {(displayData.byAppointment || isEditing) && (
            <div className="text-center mb-8">
              {isEditing ? (
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.byAppointment}
                    onChange={(e) => updateField('byAppointment', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg italic text-[#081E3F]">
                    I will also offer Office Hours by appointment
                  </span>
                </label>
              ) : (
                displayData.byAppointment && (
                  <p className="text-lg italic text-[#081E3F] inline-block px-6 py-2 rounded-lg" style={{ backgroundColor: 'rgba(182, 134, 44, 0.1)' }}>
                    I will also offer Office Hours by appointment
                  </p>
                )
              )}
            </div>
          )}

          {/* Contact Information */}
          <div className="border-t-2 border-[#B6862C] pt-6 mt-auto">
            <div className="text-center space-y-3">
              <p className="text-lg text-[#081E3F]">
                <span className="font-semibold">Email:</span>{' '}
                <EditableText
                  isEditing={isEditing}
                  value={displayData.email}
                  editValue={editData.email}
                  onChange={(v) => updateField('email', v)}
                  className="text-blue-600"
                />
              </p>
              <p className="text-lg text-[#081E3F]">
                <span className="font-semibold">Office Location:</span>{' '}
                <EditableText
                  isEditing={isEditing}
                  value={displayData.officeLocation}
                  editValue={editData.officeLocation}
                  onChange={(v) => updateField('officeLocation', v)}
                />
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Department of Teaching and Learning
            </p>
          </div>
        </div>
      </div>
    );
  }
);

SignCard.displayName = 'SignCard';

export default SignCard;
