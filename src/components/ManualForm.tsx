'use client';

import { useState } from 'react';
import { ProfessorData, createEmptyProfessor } from '@/types/professor';
import { User, Mail, Calendar, MapPin, Clock, Link, CheckSquare } from 'lucide-react';

interface ManualFormProps {
  onSubmit: (professor: ProfessorData) => void;
  initialData?: ProfessorData;
}

export default function ManualForm({ onSubmit, initialData }: ManualFormProps) {
  const [formData, setFormData] = useState<ProfessorData>(
    initialData || createEmptyProfessor()
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ProfessorData, string>>>({});

  const updateField = (field: keyof ProfessorData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProfessorData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required';
    }
    if (!formData.officeLocation.trim()) {
      newErrors.officeLocation = 'Office location is required';
    }
    if (!formData.officeHours.trim()) {
      newErrors.officeHours = 'Office hours are required';
    }
    if (formData.meetingLink && !/^https?:\/\/.+/.test(formData.meetingLink)) {
      newErrors.meetingLink = 'Please enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, id: formData.id || crypto.randomUUID() });
    }
  };

  const inputClasses = (field: keyof ProfessorData) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
      errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User size={16} />
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className={inputClasses('firstName')}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User size={16} />
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className={inputClasses('lastName')}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Mail size={16} />
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className={inputClasses('email')}
          placeholder="professor@university.edu"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Semester */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar size={16} />
          Semester *
        </label>
        <input
          type="text"
          value={formData.semester}
          onChange={(e) => updateField('semester', e.target.value)}
          className={inputClasses('semester')}
          placeholder="Spring 2025"
        />
        {errors.semester && (
          <p className="text-red-500 text-sm mt-1">{errors.semester}</p>
        )}
      </div>

      {/* Office Location */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin size={16} />
          Office Location *
        </label>
        <input
          type="text"
          value={formData.officeLocation}
          onChange={(e) => updateField('officeLocation', e.target.value)}
          className={inputClasses('officeLocation')}
          placeholder="ZEB XXX"
        />
        <p className="text-gray-500 text-sm mt-1">
          Building and room number. If you don&apos;t have an office, specify where Office Hours will be held.
        </p>
        {errors.officeLocation && (
          <p className="text-red-500 text-sm mt-1">{errors.officeLocation}</p>
        )}
      </div>

      {/* Office Hours */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Clock size={16} />
          Office Hours Schedule *
        </label>
        <textarea
          value={formData.officeHours}
          onChange={(e) => updateField('officeHours', e.target.value)}
          className={inputClasses('officeHours')}
          rows={4}
          placeholder="Monday: 10:00 AM - 12:00 PM
Wednesday: 2:00 PM - 4:00 PM (Online)
Friday: 10:00 AM - 11:00 AM"
        />
        <p className="text-gray-500 text-sm mt-1">
          Add &quot;(Online)&quot; next to any time slots offered virtually.
        </p>
        {errors.officeHours && (
          <p className="text-red-500 text-sm mt-1">{errors.officeHours}</p>
        )}
      </div>

      {/* Meeting Link (Optional) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Link size={16} />
          Online Meeting Link (Optional)
        </label>
        <input
          type="url"
          value={formData.meetingLink || ''}
          onChange={(e) => updateField('meetingLink', e.target.value)}
          className={inputClasses('meetingLink')}
          placeholder="https://zoom.us/j/1234567890"
        />
        <p className="text-gray-500 text-sm mt-1">
          This will be converted to a QR code on the sign.
        </p>
        {errors.meetingLink && (
          <p className="text-red-500 text-sm mt-1">{errors.meetingLink}</p>
        )}
      </div>

      {/* By Appointment */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.byAppointment}
            onChange={(e) => updateField('byAppointment', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CheckSquare size={16} />
            I will also offer Office Hours by appointment
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-3 px-6 bg-[#081E3F] text-white font-semibold rounded-lg hover:bg-[#0d2d5e] transition-colors focus:ring-4 focus:ring-blue-200"
        >
          Generate Sign
        </button>
      </div>
    </form>
  );
}
