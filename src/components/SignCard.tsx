'use client';

import { forwardRef, useState } from 'react';
import { ProfessorData } from '@/types/professor';
import QRCode from './QRCode';
import { Pencil, Check, X, Eye, EyeOff } from 'lucide-react';

interface SignCardProps {
  professor: ProfessorData;
  onUpdate?: (updated: ProfessorData) => void;
  showEditButton?: boolean;
  showHeader?: boolean;
  onToggleHeader?: () => void;
}

// Helper component for editable text fields - defined outside the render function
interface EditableTextProps {
  isEditing: boolean;
  value: string;
  editValue: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  rows?: number;
}

function EditableText({
  isEditing,
  value,
  editValue,
  onChange,
  className = '',
  style,
  multiline = false,
  rows = 3,
}: EditableTextProps) {
  if (isEditing) {
    return multiline ? (
      <textarea
        value={editValue}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded px-2 py-1 w-full resize-none ${className}`}
        style={{ backgroundColor: '#fefce8', border: '1px solid #fde047', ...style }}
        rows={rows}
      />
    ) : (
      <input
        type="text"
        value={editValue}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded px-2 py-1 ${className}`}
        style={{ backgroundColor: '#fefce8', border: '1px solid #fde047', ...style }}
      />
    );
  }
  return <span className={className} style={style}>{value}</span>;
}

const SignCard = forwardRef<HTMLDivElement, SignCardProps>(
  ({ professor, onUpdate, showEditButton = true, showHeader = true, onToggleHeader }, ref) => {
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
            {onToggleHeader && (
              <button
                onClick={onToggleHeader}
                className="p-2 text-white rounded-full shadow-md"
                style={{ backgroundColor: showHeader ? '#6b7280' : '#9ca3af' }}
                title={showHeader ? 'Hide header' : 'Show header'}
              >
                {showHeader ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-white rounded-full shadow-md"
                  style={{ backgroundColor: '#22c55e' }}
                  title="Save changes"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-white rounded-full shadow-md"
                  style={{ backgroundColor: '#ef4444' }}
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="p-2 text-white rounded-full shadow-md"
                style={{ backgroundColor: '#3b82f6', opacity: 0.9 }}
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
          className="sign-card rounded-lg shadow-lg p-8 max-w-[8.5in] mx-auto"
          style={{
            width: '8.5in',
            minHeight: '11in',
            fontFamily: 'Georgia, serif',
            backgroundColor: '#ffffff',
            border: '4px solid #081E3F',
          }}
        >
          {/* Header with Department branding */}
          {showHeader && (
            <div className="text-center pb-4 mb-6" style={{ borderBottom: '2px solid #B6862C' }}>
              <h1 className="text-2xl font-bold tracking-wide" style={{ color: '#081E3F' }}>
                Department of Teaching and Learning
              </h1>
            </div>
          )}

          {/* Professor Name */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#081E3F' }}>
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
            <div className="inline-block px-8 py-3 rounded-lg" style={{ backgroundColor: '#081E3F', color: '#ffffff' }}>
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
          <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: '#f9fafb', border: '2px solid #081E3F' }}>
            <h4 className="text-xl font-bold mb-4 text-center" style={{ color: '#081E3F' }}>Schedule</h4>
            <div className="text-center text-lg leading-relaxed whitespace-pre-wrap">
              {isEditing ? (
                <textarea
                  value={editData.officeHours}
                  onChange={(e) => updateField('officeHours', e.target.value)}
                  className="rounded px-2 py-1 w-full resize-none text-center"
                  style={{ backgroundColor: '#fefce8', border: '1px solid #fde047' }}
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
                <p className="text-sm mb-2 font-semibold" style={{ color: '#4b5563' }}>Online Meeting Link</p>
                <QRCode url={displayData.meetingLink} size={140} />
                {isEditing && (
                  <input
                    type="url"
                    value={editData.meetingLink || ''}
                    onChange={(e) => updateField('meetingLink', e.target.value)}
                    placeholder="Meeting URL"
                    className="mt-2 rounded px-2 py-1 text-sm w-full"
                    style={{ backgroundColor: '#fefce8', border: '1px solid #fde047' }}
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
                  <span className="text-lg italic" style={{ color: '#081E3F' }}>
                    I will also offer Office Hours by appointment
                  </span>
                </label>
              ) : (
                displayData.byAppointment && (
                  <p className="text-lg italic inline-block px-6 py-2 rounded-lg" style={{ color: '#081E3F', backgroundColor: 'rgba(182, 134, 44, 0.1)' }}>
                    I will also offer Office Hours by appointment
                  </p>
                )
              )}
            </div>
          )}

          {/* Contact Information */}
          <div className="pt-6 mt-auto" style={{ borderTop: '2px solid #B6862C' }}>
            <div className="text-center space-y-3">
              <p className="text-lg" style={{ color: '#081E3F' }}>
                <span className="font-semibold">Email:</span>{' '}
                <EditableText
                  isEditing={isEditing}
                  value={displayData.email}
                  editValue={editData.email}
                  onChange={(v) => updateField('email', v)}
                  style={{ color: '#2563eb' }}
                />
              </p>
              <p className="text-lg" style={{ color: '#081E3F' }}>
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
          <div className="mt-8 pt-4 text-center" style={{ borderTop: '1px solid #e5e7eb' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>
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
