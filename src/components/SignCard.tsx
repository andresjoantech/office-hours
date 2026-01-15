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

    // Inline editable input style
    const editInputStyle: React.CSSProperties = {
      backgroundColor: '#fefce8',
      border: '1px solid #fde047',
      borderRadius: '4px',
      padding: '2px 8px',
    };

    return (
      <div className="relative">
        {/* Edit Controls */}
        {showEditButton && (
          <div className="absolute top-2 right-2 z-10 flex gap-2 print:hidden">
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
            fontFamily: 'Georgia, serif',
            backgroundColor: '#ffffff',
            border: '4px solid #081E3F',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
        >
          {/* Professor Name */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#081E3F' }}>
              {isEditing ? (
                <>
                  Professor{' '}
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    style={editInputStyle}
                  />{' '}
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    style={editInputStyle}
                  />
                </>
              ) : (
                <>Professor {displayData.firstName} {displayData.lastName}</>
              )}
            </h2>
          </div>

          {/* Office Hours Title */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B6862C',
                fontSize: '1.5rem',
                fontWeight: '600',
                lineHeight: '1.2',
                textAlign: 'center',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              {isEditing ? (
                <>
                  Office Hours for{' '}
                  <input
                    type="text"
                    value={editData.semester}
                    onChange={(e) => updateField('semester', e.target.value)}
                    style={{ ...editInputStyle, color: '#B6862C', marginLeft: '8px' }}
                  />
                </>
              ) : (
                `Office Hours for ${displayData.semester}`
              )}
            </div>
          </div>

          {/* Office Hours Schedule */}
          <div
            className="rounded-lg p-6 mb-8"
            style={{
              backgroundColor: '#f9fafb',
              border: '2px solid #081E3F',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
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
                  <p
                    className="text-lg italic inline-block px-6 py-2 rounded-lg"
                    style={{
                      color: '#081E3F',
                      backgroundColor: 'rgba(182, 134, 44, 0.1)',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
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
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    style={{ ...editInputStyle, color: '#2563eb' }}
                  />
                ) : (
                  <span style={{ color: '#2563eb' }}>{displayData.email}</span>
                )}
              </p>
              <p className="text-lg" style={{ color: '#081E3F' }}>
                <span className="font-semibold">Office Location:</span>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.officeLocation}
                    onChange={(e) => updateField('officeLocation', e.target.value)}
                    style={editInputStyle}
                  />
                ) : (
                  <span>{displayData.officeLocation}</span>
                )}
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }
);

SignCard.displayName = 'SignCard';

export default SignCard;
