import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiShield, FiUser, FiBook, FiCalendar, FiSend,
  FiChevronRight, FiChevronLeft, FiUpload, FiLink, FiCheckCircle,
  FiTrash2, FiBriefcase, FiCpu, FiFileText, FiGlobe, FiEdit3
} from 'react-icons/fi';

// ─── Step definitions ────────────────────────────────────────────
const STEPS = [
  { id: 'personal', label: 'Personal Details', icon: FiUser },
  { id: 'academic', label: 'Academic Details', icon: FiBook },
  { id: 'internship', label: 'Internship Details', icon: FiCalendar },
  { id: 'faculty', label: 'Faculty Details', icon: FiBriefcase },
  { id: 'skills', label: 'Skills & Experience', icon: FiCpu },
  { id: 'documents', label: 'Document Uploads', icon: FiFileText },
  { id: 'profiles', label: 'Online Profiles', icon: FiGlobe },
  { id: 'declaration', label: 'Declaration', icon: FiEdit3 },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DRDO_LABS = [
  'DRDO HQ, New Delhi',
  'DRDL, Hyderabad',
  'RCI, Hyderabad',
  'ARDE, Pune',
  'HEMRL, Pune',
  'CAIR, Bangalore',
  'ADE, Bangalore',
  'LRDE, Bangalore',
  'GTRE, Bangalore',
  'NPOL, Kochi',
  'IRDE, Dehradun',
  'ITR, Chandipur',
  'PXE, Chandipur',
  'TBRL, Chandigarh',
  'SSPL, Delhi',
  'DEAL, Dehradun',
  'DIPR, Delhi',
  'DMRL, Hyderabad',
  'CFEES, Delhi',
  'DFRL, Mysuru',
  'Other',
];

const RESEARCH_DOMAINS = [
  'Radar Systems & Signal Processing',
  'Electronic Warfare',
  'AI & Machine Learning',
  'Robotics & Autonomous Systems',
  'Missile Technology',
  'Cyber Security',
  'Embedded Systems',
  'IoT & Sensor Networks',
  'VLSI & Microelectronics',
  'Communication Systems',
  'Image Processing & Computer Vision',
  'Material Science',
  'Aerospace Engineering',
  'Naval Systems',
  'Life Sciences & Bioengineering',
  'Other',
];

const MANDATORY_DOCUMENTS = [
  { key: 'photo', label: 'Recent Passport-size Photograph', required: true },
  { key: 'resume', label: 'Resume/CV', required: true },
  { key: 'bonafide', label: 'Bonafide Certificate', required: true },
  { key: 'noc', label: 'No Objection Certificate (NOC)', required: true },
  { key: 'lor', label: 'Letter of Recommendation (LOR)', required: false, note: 'if required' },
  { key: 'sop', label: 'Statement of Purpose (SOP)', required: true },
  { key: 'collegeId', label: 'College ID Card', required: true },
  { key: 'aadhaar', label: 'Aadhaar Card', required: true },
  { key: 'latestMarksheet', label: 'Latest Semester Marksheet/Transcript', required: true },
  { key: 'classXMarksheet', label: 'Class X Marksheet', required: true },
  { key: 'classXIIMarksheet', label: 'Class XII Marksheet', required: true },
  { key: 'casteCert', label: 'Caste Certificate', required: false, note: 'if applicable' },
  { key: 'pwdCert', label: 'PwD Certificate', required: false, note: 'if applicable' },
  { key: 'incomeCert', label: 'Income Certificate', required: false, note: 'if applicable' },
  { key: 'characterCert', label: 'Character Certificate', required: false, note: 'if required' },
  { key: 'medicalCert', label: 'Medical Fitness Certificate', required: false, note: 'if required' },
  { key: 'policeCert', label: 'Police Verification Certificate', required: false, note: 'only if specifically asked' },
  { key: 'researchProposal', label: 'Research Proposal/Project Synopsis', required: false, note: 'if applicable' },
  { key: 'portfolio', label: 'Portfolio/GitHub/Research Links', required: false, note: 'optional' },
];

// ─── Helpers ─────────────────────────────────────────────────────
function FormField({ label, required, children, hint, className = '' }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <h3 className="text-sm font-bold text-military-dark mb-5 flex items-center gap-2 pb-3 border-b border-surface-border">
      <Icon className="w-4 h-4 text-gold" /> {title}
    </h3>
  );
}

function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="form-input flex-1"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-military-green text-white rounded-xl text-xs font-semibold hover:bg-military-light transition-colors">Add</button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-military-green/10 text-military-green text-xs font-medium px-2.5 py-1 rounded-lg">
              {tag}
              <button type="button" onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-red-500 transition-colors">
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function FileUploadItem({ doc, file, onFileChange }: {
  doc: { key: string; label: string; required: boolean; note?: string };
  file: File | null;
  onFileChange: (key: string, file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${file ? 'border-military-green/40 bg-military-green/5' : 'border-surface-border bg-white hover:border-gray-300'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${file ? 'bg-military-green/10' : 'bg-gray-100'}`}>
        {file ? <FiCheckCircle className="w-4 h-4 text-military-green" /> : <FiUpload className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700 leading-snug">
          {doc.required && <span className="text-red-500 mr-0.5">*</span>}
          {doc.label}
          {doc.note && <span className="text-gray-400 font-normal ml-1">({doc.note})</span>}
        </p>
        {file && <p className="text-xs text-military-green mt-0.5 truncate">{file.name}</p>}
      </div>
      <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => onFileChange(doc.key, e.target.files?.[0] || null)} />
      {file ? (
        <button type="button" onClick={() => onFileChange(doc.key, null)} className="text-red-400 hover:text-red-600 transition-colors p-1">
          <FiTrash2 className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-semibold text-military-green hover:text-military-light transition-colors px-3 py-1.5 border border-military-green/30 rounded-lg hover:bg-military-green/5">
          Upload
        </button>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export default function ApplicationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // ── Personal Details ──
  const [personal, setPersonal] = useState({
    fullName: '', dob: '', gender: '', nationality: 'Indian',
    aadhaarNumber: '', panNumber: '', passportNumber: '',
    mobileNumber: '', altMobileNumber: '',
    email: '', altEmail: '',
    currentAddress: '', permanentAddress: '', sameAddress: false,
    emergencyContactName: '', emergencyContactNumber: '',
    bloodGroup: '',
  });

  // ── Academic Details ──
  const [academic, setAcademic] = useState({
    collegeName: '', collegeAddress: '', degree: '', branch: '',
    currentSemester: '', enrollmentNumber: '', universityRegNumber: '',
    cgpa: '', expectedGradYear: '',
    classXBoard: '', classXSchool: '', classXPercentage: '', classXYear: '',
    classXIIBoard: '', classXIISchool: '', classXIIPercentage: '', classXIIYear: '',
  });

  // ── Internship Details ──
  const [internship, setInternship] = useState({
    preferredLab: '', preferredDomain: '', duration: '',
    preferredStartDate: '', preferredEndDate: '', mode: '',
  });

  // ── Faculty Details ──
  const [faculty, setFaculty] = useState({
    guideName: '', designation: '', department: '',
    officialEmail: '', contactNumber: '',
  });

  // ── Skills & Experience ──
  const [programmingLangs, setProgrammingLangs] = useState<string[]>([]);
  const [softwareTools, setSoftwareTools] = useState<string[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [coursework, setCoursework] = useState<string[]>([]);
  const [researchInterests, setResearchInterests] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [skills, setSkills] = useState({
    previousInternships: '', projects: '',
    publications: '', patents: '',
    hackathons: '',
  });

  // ── Documents ──
  const [documents, setDocuments] = useState<Record<string, File | null>>({});

  // ── Online Profiles ──
  const [profiles, setProfiles] = useState({
    linkedin: '', github: '', portfolio: '',
    googleScholar: '', orcid: '',
  });

  // ── Declaration ──
  const [declaration, setDeclaration] = useState({
    agreed: false, place: '', date: '',
    applicantSignature: '', facultySignature: '',
    hodSignature: '', principalSignature: '', collegeSeal: '',
  });

  // Photo preview
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocChange = useCallback((key: string, file: File | null) => {
    setDocuments(prev => ({ ...prev, [key]: file }));
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setStep(0);
    onClose();
  };

  const nextStep = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  if (!isOpen) return null;

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4"
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="bg-military-dark px-6 md:px-8 py-5 flex-shrink-0">
            <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10">
              <FiX className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                <FiShield className="w-5 h-5 text-military-dark" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">509 Internship Application</h2>
                <p className="text-white/60 text-xs">TT Cell – 509 Army Base Workshop</p>
              </div>
            </div>
            {/* Progress bar */}
            {!submitted && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-xs font-medium">Step {step + 1} of {STEPS.length}</span>
                  <span className="text-gold text-xs font-bold">{STEPS[step].label}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold rounded-full"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {/* Step indicators */}
                <div className="flex gap-1 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                  {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const isActive = i === step;
                    const isDone = i < step;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStep(i)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                          isActive ? 'bg-gold text-military-dark' :
                          isDone ? 'bg-white/15 text-gold' :
                          'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                        }`}
                      >
                        {isDone ? <FiCheckCircle className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {submitted ? (
              <div className="py-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
                  <div className="w-20 h-20 bg-military-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-military-dark mb-2">Application Submitted!</h3>
                  <p className="text-gray-500 text-sm mb-2">Your 509 internship application has been submitted successfully.</p>
                  <p className="text-gray-400 text-xs mb-8">We will review your application and notify you via email. Please keep your documents ready for verification.</p>
                  <button onClick={handleClose} className="btn-primary">Close</button>
                </motion.div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* ────────── STEP 0: Personal Details ────────── */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <SectionTitle icon={FiUser} title="Personal Details" />

                      {/* Photo Upload */}
                      <div className="flex items-center gap-5 p-4 bg-surface-muted rounded-2xl border border-surface-border">
                        <div
                          onClick={() => photoRef.current?.click()}
                          className="w-24 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-military-green transition-colors overflow-hidden flex-shrink-0 bg-white"
                        >
                          {photoPreview ? (
                            <img src={photoPreview} alt="Photo" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <FiUpload className="w-5 h-5 text-gray-400 mb-1" />
                              <span className="text-xs text-gray-400">Photo</span>
                            </>
                          )}
                        </div>
                        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        <div>
                          <p className="text-sm font-bold text-military-dark">Passport-size Photograph <span className="text-red-500">*</span></p>
                          <p className="text-xs text-gray-500 mt-1">Upload a recent passport-size photo (JPEG/PNG, max 500KB)</p>
                          <p className="text-xs text-gray-400 mt-0.5">White background, formal attire preferred</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="Full Name (as per Aadhaar)" required className="md:col-span-2">
                          <input type="text" value={personal.fullName} onChange={e => setPersonal(p => ({ ...p, fullName: e.target.value }))} placeholder="Enter your full name" className="form-input" />
                        </FormField>
                        <FormField label="Date of Birth" required>
                          <input type="date" value={personal.dob} onChange={e => setPersonal(p => ({ ...p, dob: e.target.value }))} className="form-input" />
                        </FormField>
                        <FormField label="Gender" required>
                          <select value={personal.gender} onChange={e => setPersonal(p => ({ ...p, gender: e.target.value }))} className="form-input">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </FormField>
                        <FormField label="Nationality" required>
                          <input type="text" value={personal.nationality} onChange={e => setPersonal(p => ({ ...p, nationality: e.target.value }))} placeholder="Indian" className="form-input" />
                        </FormField>
                        <FormField label="Blood Group" hint="Optional">
                          <select value={personal.bloodGroup} onChange={e => setPersonal(p => ({ ...p, bloodGroup: e.target.value }))} className="form-input">
                            <option value="">Select Blood Group</option>
                            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                          </select>
                        </FormField>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField label="Aadhaar Number" required>
                          <input type="text" value={personal.aadhaarNumber} onChange={e => setPersonal(p => ({ ...p, aadhaarNumber: e.target.value }))} placeholder="XXXX XXXX XXXX" maxLength={14} className="form-input" />
                        </FormField>
                        <FormField label="PAN Number" hint="if applicable">
                          <input type="text" value={personal.panNumber} onChange={e => setPersonal(p => ({ ...p, panNumber: e.target.value }))} placeholder="ABCDE1234F" maxLength={10} className="form-input" />
                        </FormField>
                        <FormField label="Passport Number" hint="if applicable">
                          <input type="text" value={personal.passportNumber} onChange={e => setPersonal(p => ({ ...p, passportNumber: e.target.value }))} placeholder="A1234567" className="form-input" />
                        </FormField>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="Mobile Number" required>
                          <input type="tel" value={personal.mobileNumber} onChange={e => setPersonal(p => ({ ...p, mobileNumber: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="form-input" />
                        </FormField>
                        <FormField label="Alternate Mobile Number">
                          <input type="tel" value={personal.altMobileNumber} onChange={e => setPersonal(p => ({ ...p, altMobileNumber: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="form-input" />
                        </FormField>
                        <FormField label="Email Address" required>
                          <input type="email" value={personal.email} onChange={e => setPersonal(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="form-input" />
                        </FormField>
                        <FormField label="Alternate Email Address">
                          <input type="email" value={personal.altEmail} onChange={e => setPersonal(p => ({ ...p, altEmail: e.target.value }))} placeholder="alternate@example.com" className="form-input" />
                        </FormField>
                      </div>

                      <FormField label="Current Address" required>
                        <textarea value={personal.currentAddress} onChange={e => setPersonal(p => ({ ...p, currentAddress: e.target.value }))} rows={2} placeholder="Full current address with PIN code" className="form-input resize-none" />
                      </FormField>
                      <div className="flex items-center gap-2 -mt-2">
                        <input
                          type="checkbox"
                          id="sameAddress"
                          checked={personal.sameAddress}
                          onChange={e => {
                            const checked = e.target.checked;
                            setPersonal(p => ({
                              ...p,
                              sameAddress: checked,
                              permanentAddress: checked ? p.currentAddress : p.permanentAddress,
                            }));
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-military-green focus:ring-military-green"
                        />
                        <label htmlFor="sameAddress" className="text-xs text-gray-500">Same as current address</label>
                      </div>
                      {!personal.sameAddress && (
                        <FormField label="Permanent Address" required>
                          <textarea value={personal.permanentAddress} onChange={e => setPersonal(p => ({ ...p, permanentAddress: e.target.value }))} rows={2} placeholder="Full permanent address with PIN code" className="form-input resize-none" />
                        </FormField>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="Emergency Contact Name" required>
                          <input type="text" value={personal.emergencyContactName} onChange={e => setPersonal(p => ({ ...p, emergencyContactName: e.target.value }))} placeholder="Contact person name" className="form-input" />
                        </FormField>
                        <FormField label="Emergency Contact Number" required>
                          <input type="tel" value={personal.emergencyContactNumber} onChange={e => setPersonal(p => ({ ...p, emergencyContactNumber: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="form-input" />
                        </FormField>
                      </div>
                    </div>
                  )}

                  {/* ────────── STEP 1: Academic Details ────────── */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <SectionTitle icon={FiBook} title="Academic Details" />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="College/University Name" required className="md:col-span-2">
                          <input type="text" value={academic.collegeName} onChange={e => setAcademic(a => ({ ...a, collegeName: e.target.value }))} placeholder="Full name of institution" className="form-input" />
                        </FormField>
                        <FormField label="College Address" required className="md:col-span-2">
                          <input type="text" value={academic.collegeAddress} onChange={e => setAcademic(a => ({ ...a, collegeAddress: e.target.value }))} placeholder="City, State" className="form-input" />
                        </FormField>
                        <FormField label="Degree" required>
                          <select value={academic.degree} onChange={e => setAcademic(a => ({ ...a, degree: e.target.value }))} className="form-input">
                            <option value="">Select Degree</option>
                            <option value="btech">B.Tech / B.E.</option>
                            <option value="mtech">M.Tech / M.E.</option>
                            <option value="bsc">B.Sc</option>
                            <option value="msc">M.Sc</option>
                            <option value="mca">MCA</option>
                            <option value="phd">Ph.D</option>
                            <option value="diploma">Diploma</option>
                            <option value="other">Other</option>
                          </select>
                        </FormField>
                        <FormField label="Branch/Specialization" required>
                          <input type="text" value={academic.branch} onChange={e => setAcademic(a => ({ ...a, branch: e.target.value }))} placeholder="e.g., Computer Science, ECE" className="form-input" />
                        </FormField>
                        <FormField label="Current Semester/Year" required>
                          <select value={academic.currentSemester} onChange={e => setAcademic(a => ({ ...a, currentSemester: e.target.value }))} className="form-input">
                            <option value="">Select</option>
                            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            <option value="completed">Completed</option>
                          </select>
                        </FormField>
                        <FormField label="Enrollment/Roll Number" required>
                          <input type="text" value={academic.enrollmentNumber} onChange={e => setAcademic(a => ({ ...a, enrollmentNumber: e.target.value }))} placeholder="Roll/Enrollment No." className="form-input" />
                        </FormField>
                        <FormField label="University Registration Number" required>
                          <input type="text" value={academic.universityRegNumber} onChange={e => setAcademic(a => ({ ...a, universityRegNumber: e.target.value }))} placeholder="University Reg. No." className="form-input" />
                        </FormField>
                        <FormField label="CGPA/Percentage" required>
                          <input type="text" value={academic.cgpa} onChange={e => setAcademic(a => ({ ...a, cgpa: e.target.value }))} placeholder="e.g., 8.5 or 85%" className="form-input" />
                        </FormField>
                        <FormField label="Expected Graduation Year" required>
                          <select value={academic.expectedGradYear} onChange={e => setAcademic(a => ({ ...a, expectedGradYear: e.target.value }))} className="form-input">
                            <option value="">Select Year</option>
                            {[2025,2026,2027,2028,2029,2030].map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </FormField>
                      </div>

                      {/* Class X */}
                      <div className="p-4 bg-surface-muted rounded-2xl border border-surface-border">
                        <p className="text-xs font-bold text-military-dark mb-3">📄 Class X Details</p>
                        <div className="grid md:grid-cols-4 gap-3">
                          <FormField label="Board" required>
                            <input type="text" value={academic.classXBoard} onChange={e => setAcademic(a => ({ ...a, classXBoard: e.target.value }))} placeholder="CBSE/ICSE/State" className="form-input" />
                          </FormField>
                          <FormField label="School" required>
                            <input type="text" value={academic.classXSchool} onChange={e => setAcademic(a => ({ ...a, classXSchool: e.target.value }))} placeholder="School name" className="form-input" />
                          </FormField>
                          <FormField label="Percentage" required>
                            <input type="text" value={academic.classXPercentage} onChange={e => setAcademic(a => ({ ...a, classXPercentage: e.target.value }))} placeholder="e.g., 92%" className="form-input" />
                          </FormField>
                          <FormField label="Year" required>
                            <input type="text" value={academic.classXYear} onChange={e => setAcademic(a => ({ ...a, classXYear: e.target.value }))} placeholder="e.g., 2019" className="form-input" />
                          </FormField>
                        </div>
                      </div>

                      {/* Class XII */}
                      <div className="p-4 bg-surface-muted rounded-2xl border border-surface-border">
                        <p className="text-xs font-bold text-military-dark mb-3">📄 Class XII Details</p>
                        <div className="grid md:grid-cols-4 gap-3">
                          <FormField label="Board" required>
                            <input type="text" value={academic.classXIIBoard} onChange={e => setAcademic(a => ({ ...a, classXIIBoard: e.target.value }))} placeholder="CBSE/ICSE/State" className="form-input" />
                          </FormField>
                          <FormField label="School" required>
                            <input type="text" value={academic.classXIISchool} onChange={e => setAcademic(a => ({ ...a, classXIISchool: e.target.value }))} placeholder="School name" className="form-input" />
                          </FormField>
                          <FormField label="Percentage" required>
                            <input type="text" value={academic.classXIIPercentage} onChange={e => setAcademic(a => ({ ...a, classXIIPercentage: e.target.value }))} placeholder="e.g., 88%" className="form-input" />
                          </FormField>
                          <FormField label="Year" required>
                            <input type="text" value={academic.classXIIYear} onChange={e => setAcademic(a => ({ ...a, classXIIYear: e.target.value }))} placeholder="e.g., 2021" className="form-input" />
                          </FormField>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ────────── STEP 2: Internship Details ────────── */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <SectionTitle icon={FiCalendar} title="Internship Details" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="Preferred 509 Lab/Establishment" required className="md:col-span-2">
                          <select value={internship.preferredLab} onChange={e => setInternship(i => ({ ...i, preferredLab: e.target.value }))} className="form-input">
                            <option value="">Select Lab</option>
                            {DRDO_LABS.map(lab => <option key={lab} value={lab}>{lab}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Preferred Research Domain" required className="md:col-span-2">
                          <select value={internship.preferredDomain} onChange={e => setInternship(i => ({ ...i, preferredDomain: e.target.value }))} className="form-input">
                            <option value="">Select Domain</option>
                            {RESEARCH_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Internship Duration" required>
                          <select value={internship.duration} onChange={e => setInternship(i => ({ ...i, duration: e.target.value }))} className="form-input">
                            <option value="">Select Duration</option>
                            <option value="2weeks">2 Weeks</option>
                            <option value="1month">1 Month</option>
                            <option value="2months">2 Months</option>
                            <option value="3months">3 Months</option>
                            <option value="6months">6 Months</option>
                            <option value="1year">1 Year</option>
                          </select>
                        </FormField>
                        <FormField label="Mode" required>
                          <select value={internship.mode} onChange={e => setInternship(i => ({ ...i, mode: e.target.value }))} className="form-input">
                            <option value="">Select Mode</option>
                            <option value="offline">Offline (On-site)</option>
                            <option value="online">Online (Remote)</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </FormField>
                        <FormField label="Preferred Start Date" required>
                          <input type="date" value={internship.preferredStartDate} onChange={e => setInternship(i => ({ ...i, preferredStartDate: e.target.value }))} className="form-input" />
                        </FormField>
                        <FormField label="Preferred End Date" required>
                          <input type="date" value={internship.preferredEndDate} onChange={e => setInternship(i => ({ ...i, preferredEndDate: e.target.value }))} className="form-input" />
                        </FormField>
                      </div>
                    </div>
                  )}

                  {/* ────────── STEP 3: Faculty Details ────────── */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <SectionTitle icon={FiBriefcase} title="Faculty Guide Details" />
                      <div className="p-4 bg-surface-muted rounded-2xl border border-surface-border mb-2">
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Please provide details of your faculty guide who will be supervising your internship from your institution. The faculty guide must be aware of your application.
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="Faculty Guide Name" required className="md:col-span-2">
                          <input type="text" value={faculty.guideName} onChange={e => setFaculty(f => ({ ...f, guideName: e.target.value }))} placeholder="Prof. / Dr. Full Name" className="form-input" />
                        </FormField>
                        <FormField label="Designation" required>
                          <input type="text" value={faculty.designation} onChange={e => setFaculty(f => ({ ...f, designation: e.target.value }))} placeholder="e.g., Associate Professor" className="form-input" />
                        </FormField>
                        <FormField label="Department" required>
                          <input type="text" value={faculty.department} onChange={e => setFaculty(f => ({ ...f, department: e.target.value }))} placeholder="e.g., Dept. of CSE" className="form-input" />
                        </FormField>
                        <FormField label="Official Email ID" required>
                          <input type="email" value={faculty.officialEmail} onChange={e => setFaculty(f => ({ ...f, officialEmail: e.target.value }))} placeholder="faculty@college.edu" className="form-input" />
                        </FormField>
                        <FormField label="Contact Number" required>
                          <input type="tel" value={faculty.contactNumber} onChange={e => setFaculty(f => ({ ...f, contactNumber: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="form-input" />
                        </FormField>
                      </div>
                    </div>
                  )}

                  {/* ────────── STEP 4: Skills & Experience ────────── */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <SectionTitle icon={FiCpu} title="Skills & Experience" />

                      <FormField label="Programming Languages" required>
                        <TagInput tags={programmingLangs} onChange={setProgrammingLangs} placeholder="e.g., Python, C++, Java" />
                      </FormField>
                      <FormField label="Software/Tools Known" required>
                        <TagInput tags={softwareTools} onChange={setSoftwareTools} placeholder="e.g., MATLAB, TensorFlow, AutoCAD" />
                      </FormField>
                      <FormField label="Technical Skills" required>
                        <TagInput tags={technicalSkills} onChange={setTechnicalSkills} placeholder="e.g., PCB Design, Signal Processing" />
                      </FormField>
                      <FormField label="Relevant Coursework">
                        <TagInput tags={coursework} onChange={setCoursework} placeholder="e.g., Digital Signal Processing, ML" />
                      </FormField>
                      <FormField label="Research Interests">
                        <TagInput tags={researchInterests} onChange={setResearchInterests} placeholder="e.g., Radar Systems, Deep Learning" />
                      </FormField>
                      <FormField label="Certifications">
                        <TagInput tags={certifications} onChange={setCertifications} placeholder="e.g., AWS Certified, NPTEL" />
                      </FormField>

                      <hr className="border-surface-border" />

                      <FormField label="Previous Internships" hint="Mention organization, role, and duration">
                        <textarea value={skills.previousInternships} onChange={e => setSkills(s => ({ ...s, previousInternships: e.target.value }))} rows={2} placeholder="e.g., Summer Intern at XYZ Lab, May-Jul 2025" className="form-input resize-none" />
                      </FormField>
                      <FormField label="Projects" hint="List your major projects with brief descriptions">
                        <textarea value={skills.projects} onChange={e => setSkills(s => ({ ...s, projects: e.target.value }))} rows={3} placeholder="Project title – Brief description" className="form-input resize-none" />
                      </FormField>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="Publications" hint="if any">
                          <textarea value={skills.publications} onChange={e => setSkills(s => ({ ...s, publications: e.target.value }))} rows={2} placeholder="Paper title, Journal/Conference, Year" className="form-input resize-none" />
                        </FormField>
                        <FormField label="Patents" hint="if any">
                          <textarea value={skills.patents} onChange={e => setSkills(s => ({ ...s, patents: e.target.value }))} rows={2} placeholder="Patent title, Application No." className="form-input resize-none" />
                        </FormField>
                      </div>
                      <FormField label="Hackathons/Competitions" hint="List any relevant competitions with results">
                        <textarea value={skills.hackathons} onChange={e => setSkills(s => ({ ...s, hackathons: e.target.value }))} rows={2} placeholder="Competition name – Result/Rank" className="form-input resize-none" />
                      </FormField>
                    </div>
                  )}

                  {/* ────────── STEP 5: Document Uploads ────────── */}
                  {step === 5 && (
                    <div className="space-y-4">
                      <SectionTitle icon={FiFileText} title="Mandatory Document Uploads" />
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-2">
                        <p className="text-xs text-amber-800 leading-relaxed">
                          <strong>📋 Instructions:</strong> Upload documents in PDF, JPG, or PNG format. Maximum file size: 2MB per document.
                          Fields marked with <span className="text-red-500">*</span> are mandatory.
                        </p>
                      </div>
                      <div className="space-y-2.5">
                        {MANDATORY_DOCUMENTS.map(doc => (
                          <FileUploadItem
                            key={doc.key}
                            doc={doc}
                            file={documents[doc.key] || null}
                            onFileChange={handleDocChange}
                          />
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-military-green/5 rounded-xl border border-military-green/15">
                        <p className="text-xs text-military-green font-semibold">
                          ✅ {Object.values(documents).filter(Boolean).length} of {MANDATORY_DOCUMENTS.length} documents uploaded
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ────────── STEP 6: Online Profiles ────────── */}
                  {step === 6 && (
                    <div className="space-y-5">
                      <SectionTitle icon={FiGlobe} title="Online Profile Links" />
                      <div className="p-4 bg-surface-muted rounded-2xl border border-surface-border mb-2">
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Providing your online profiles helps us better evaluate your skills and research contributions. LinkedIn and GitHub are highly recommended.
                        </p>
                      </div>
                      <div className="space-y-4">
                        {[
                          { key: 'linkedin', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/yourprofile', icon: '🔗' },
                          { key: 'github', label: 'GitHub Profile', placeholder: 'https://github.com/yourusername', icon: '💻' },
                          { key: 'portfolio', label: 'Portfolio Website', placeholder: 'https://yourportfolio.com', icon: '🌐' },
                          { key: 'googleScholar', label: 'Google Scholar', placeholder: 'https://scholar.google.com/...', icon: '📚', hint: 'if applicable' },
                          { key: 'orcid', label: 'ORCID', placeholder: 'https://orcid.org/0000-0000-0000-0000', icon: '🔬', hint: 'if applicable' },
                        ].map(field => (
                          <FormField key={field.key} label={`${field.icon} ${field.label}`} hint={field.hint}>
                            <div className="relative">
                              <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="url"
                                value={profiles[field.key as keyof typeof profiles]}
                                onChange={e => setProfiles(p => ({ ...p, [field.key]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="form-input pl-9"
                              />
                            </div>
                          </FormField>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ────────── STEP 7: Declaration ────────── */}
                  {step === 7 && (
                    <div className="space-y-5">
                      <SectionTitle icon={FiEdit3} title="Declaration & Signatures" />

                      <div className="p-5 bg-surface-muted rounded-2xl border border-surface-border">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          I hereby declare that the information furnished in this application is true, complete and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect at any stage, my candidature/internship shall be liable to be cancelled/terminated without any notice or compensation.
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed mt-3">
                          I also declare that I have not been debarred from appearing in any examination, nor have I been convicted by any court. I agree to abide by the rules and regulations of the 509 lab/establishment during the period of my internship.
                        </p>
                      </div>

                      <div className="flex items-start gap-3 p-4 border-2 border-military-green/20 rounded-2xl bg-military-green/5">
                        <input
                          type="checkbox"
                          id="declaration"
                          checked={declaration.agreed}
                          onChange={e => setDeclaration(d => ({ ...d, agreed: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-300 text-military-green focus:ring-military-green mt-0.5"
                        />
                        <label htmlFor="declaration" className="text-sm text-military-dark font-medium leading-snug cursor-pointer">
                          I have read and agree to the above declaration. All information provided is true and accurate. <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="Place" required>
                          <input type="text" value={declaration.place} onChange={e => setDeclaration(d => ({ ...d, place: e.target.value }))} placeholder="City name" className="form-input" />
                        </FormField>
                        <FormField label="Date" required>
                          <input type="date" value={declaration.date} onChange={e => setDeclaration(d => ({ ...d, date: e.target.value }))} className="form-input" />
                        </FormField>
                      </div>

                      <p className="text-xs font-bold text-military-dark mt-2">Signatures</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField label="Applicant Signature (Type full name)" required>
                          <input type="text" value={declaration.applicantSignature} onChange={e => setDeclaration(d => ({ ...d, applicantSignature: e.target.value }))} placeholder="Type your full name as signature" className="form-input font-signature" />
                        </FormField>
                        <FormField label="Faculty Guide Signature (Type full name)">
                          <input type="text" value={declaration.facultySignature} onChange={e => setDeclaration(d => ({ ...d, facultySignature: e.target.value }))} placeholder="Faculty guide's full name" className="form-input font-signature" />
                        </FormField>
                        <FormField label="Head of Department Signature" hint="if required">
                          <input type="text" value={declaration.hodSignature} onChange={e => setDeclaration(d => ({ ...d, hodSignature: e.target.value }))} placeholder="HOD's full name" className="form-input font-signature" />
                        </FormField>
                        <FormField label="Principal/Dean Signature" hint="if required">
                          <input type="text" value={declaration.principalSignature} onChange={e => setDeclaration(d => ({ ...d, principalSignature: e.target.value }))} placeholder="Principal/Dean's full name" className="form-input font-signature" />
                        </FormField>
                      </div>
                      <FormField label="College Seal" hint="Upload image of college seal if required">
                        <input type="file" accept="image/*,.pdf" className="form-input text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-military-green/10 file:text-military-green hover:file:bg-military-green/20 file:cursor-pointer file:transition-colors" />
                      </FormField>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* ── Footer Navigation ── */}
          {!submitted && (
            <div className="flex-shrink-0 border-t border-surface-border bg-white px-6 md:px-8 py-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 0}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-military-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-gold' : i < step ? 'w-1.5 bg-military-green' : 'w-1.5 bg-gray-200'}`} />
                ))}
              </div>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 btn-primary"
                >
                  Next <FiChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!declaration.agreed}
                  className="flex items-center gap-2 btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" /> Submit Application
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
