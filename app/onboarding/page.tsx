'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Check, Sparkles, User, BookOpen, Target, Building } from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other'
]

const SUBJECT_OPTIONS = [
  'Mathematics', 'Science (Physics/Chem/Bio)', 'Biology', 'Physics', 'Chemistry',
  'Computer Science', 'English', 'History / Civics', 'Geography', 'Economics',
  'Accountancy', 'Visual Art', 'Physical Education'
]

const CAREER_DOMAIN_OPTIONS = [
  { id: 'technology', label: 'Technology & AI' },
  { id: 'engineering', label: 'Engineering & Robotics' },
  { id: 'healthcare', label: 'Medicine & Healthcare' },
  { id: 'finance', label: 'Finance & CA' },
  { id: 'business', label: 'Business & Startups' },
  { id: 'law', label: 'Law & Judiciary' },
  { id: 'design', label: 'Design & UI/UX' },
  { id: 'government', label: 'Civil Services (IAS/IPS)' },
  { id: 'defence', label: 'Defence Forces (NDA)' },
  { id: 'aviation', label: 'Aviation & Pilot' },
  { id: 'vocational', label: 'Skilled Trades & ITI' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [formData, setFormData] = useState({
    studentName: '',
    age: 15,
    currentClass: '10th',
    board: 'CBSE',
    state: 'Maharashtra',
    city: '',
    percentageObtained: 78,
    isPercentageExpected: true,
    mathMarks: 80,
    scienceMarks: 80,
    englishMarks: 75,
    socialMarks: 75,
    strongSubjects: ['Mathematics', 'Computer Science'] as string[],
    enjoyedSubjects: ['Mathematics', 'Science (Physics/Chem/Bio)'] as string[],
    dislikedSubjects: [] as string[],
    hobbies: [] as string[],
    learningStyle: 'PRACTICAL_HANDS_ON',
    workEnvironment: 'TECH_OFFICE',
    preferredStudyLocation: 'HOME_STATE',
    budgetPreference: 'BUDGET_FRIENDLY',
    govtPrivatePref: 'ANY',
    targetCity: '',
    wantsHigherEducation: true,
    careerInterests: ['technology', 'engineering'] as string[],
  })

  useEffect(() => {
    async function loadExistingProfile() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const existing = await res.json()
          if (existing && existing.studentName) {
            setFormData((prev) => ({
              ...prev,
              ...existing,
              percentageObtained: existing.percentageObtained ?? 78,
              mathMarks: existing.mathMarks ?? 80,
              scienceMarks: existing.scienceMarks ?? 80,
              englishMarks: existing.englishMarks ?? 75,
              socialMarks: existing.socialMarks ?? 75,
              strongSubjects: existing.strongSubjects ?? prev.strongSubjects,
              enjoyedSubjects: existing.enjoyedSubjects ?? prev.enjoyedSubjects,
              careerInterests: existing.careerInterests ?? prev.careerInterests,
            }))
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setFetching(false)
      }
    }
    loadExistingProfile()
  }, [])

  const toggleArrayItem = (field: 'strongSubjects' | 'enjoyedSubjects' | 'dislikedSubjects' | 'careerInterests', item: string) => {
    setFormData((prev) => {
      const current = prev[field]
      const updated = current.includes(item)
        ? current.filter((s) => s !== item)
        : [...current, item]
      return { ...prev, [field]: updated }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      router.push('/assessment')
    } catch (err) {
      console.error(err)
      router.push('/assessment')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Step Header */}
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Profile Builder · Step {step} of 4</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Background & Preferences</h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
          Providing your academic marks and study preferences helps SmartCareer calibrate exact stream fit percentages.
        </p>
        <Progress value={(step / 4) * 100} className="h-2 max-w-md mx-auto mt-4" />
      </div>

      <Card className="shadow-lg border-slate-200">
        {/* STEP 1: Personal & School */}
        {step === 1 && (
          <>
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <User className="h-4 w-4" />
                <span>Personal & School Board</span>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">Step 1: Basic Information</CardTitle>
              <CardDescription>Tell us about your current school standard and state.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <Label htmlFor="studentName" className="font-semibold text-xs text-slate-700">Student Full Name *</Label>
                <Input
                  id="studentName"
                  placeholder="e.g. Aryan Sharma"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentClass" className="font-semibold text-xs text-slate-700">Current Standard</Label>
                  <Select
                    value={formData.currentClass}
                    onValueChange={(val) => setFormData({ ...formData, currentClass: val })}
                  >
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10th">Currently in 10th Standard</SelectItem>
                      <SelectItem value="10th_completed">Just Cleared 10th Board</SelectItem>
                      <SelectItem value="9th">Currently in 9th Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="board" className="font-semibold text-xs text-slate-700">School Education Board</Label>
                  <Select
                    value={formData.board}
                    onValueChange={(val) => setFormData({ ...formData, board: val })}
                  >
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE (Central Board)</SelectItem>
                      <SelectItem value="ICSE">ICSE / CISCE</SelectItem>
                      <SelectItem value="State Board">State Secondary Board</SelectItem>
                      <SelectItem value="IB">IB / Cambridge IGCSE</SelectItem>
                      <SelectItem value="NIOS">NIOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="font-semibold text-xs text-slate-700">Home State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(val) => setFormData({ ...formData, state: val })}
                  >
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((st) => (
                        <SelectItem key={st} value={st}>{st}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city" className="font-semibold text-xs text-slate-700">City / District</Label>
                  <Input
                    id="city"
                    placeholder="e.g. Pune / Jaipur / Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-white"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t pt-4 bg-slate-50/50">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.studentName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold gap-2"
              >
                Continue to Academic Marks <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {/* STEP 2: Academic Marks */}
        {step === 2 && (
          <>
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <BookOpen className="h-4 w-4" />
                <span>10th Standard Academic Marks</span>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">Step 2: Subject-Wise Performance</CardTitle>
              <CardDescription>Enter your actual or expected marks out of 100.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {/* Overall Percentage */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="percentage" className="font-bold text-xs text-blue-950">
                    Overall 10th Score / Percentage: {formData.percentageObtained}%
                  </Label>
                  <span className="text-xs font-extrabold text-blue-700">{formData.percentageObtained}%</span>
                </div>
                <Input
                  id="percentage"
                  type="number"
                  min="35"
                  max="100"
                  value={formData.percentageObtained}
                  onChange={(e) => setFormData({ ...formData, percentageObtained: Number(e.target.value) })}
                  className="bg-white"
                />
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="isExpected"
                    checked={formData.isPercentageExpected}
                    onCheckedChange={(val) => setFormData({ ...formData, isPercentageExpected: !!val })}
                  />
                  <Label htmlFor="isExpected" className="text-xs text-slate-600 cursor-pointer">
                    This is an expected / projected score (results pending)
                  </Label>
                </div>
              </div>

              {/* Granular Marks */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Subject Marks (Out of 100):</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Mathematics</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.mathMarks ?? ''}
                      onChange={(e) => setFormData({ ...formData, mathMarks: Number(e.target.value) })}
                      placeholder="e.g. 85"
                      className="bg-white text-center font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Science</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.scienceMarks ?? ''}
                      onChange={(e) => setFormData({ ...formData, scienceMarks: Number(e.target.value) })}
                      placeholder="e.g. 80"
                      className="bg-white text-center font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">English</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.englishMarks ?? ''}
                      onChange={(e) => setFormData({ ...formData, englishMarks: Number(e.target.value) })}
                      placeholder="e.g. 75"
                      className="bg-white text-center font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Social Science</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.socialMarks ?? ''}
                      onChange={(e) => setFormData({ ...formData, socialMarks: Number(e.target.value) })}
                      placeholder="e.g. 78"
                      className="bg-white text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Interests */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Subjects You Enjoy Most (Click to Select):</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = formData.enjoyedSubjects.includes(sub)
                    return (
                      <Badge
                        key={sub}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer py-1.5 px-3 text-xs transition select-none ${
                          isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 bg-white text-slate-700'
                        }`}
                        onClick={() => toggleArrayItem('enjoyedSubjects', sub)}
                      >
                        {isSelected && <Check className="h-3 w-3 mr-1 inline" />}
                        {sub}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Subjects You Find Stressful / Dislike (Optional):</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = formData.dislikedSubjects.includes(sub)
                    return (
                      <Badge
                        key={sub}
                        variant={isSelected ? 'destructive' : 'outline'}
                        className={`cursor-pointer py-1.5 px-3 text-xs transition select-none ${
                          isSelected ? 'bg-red-600 text-white' : 'hover:bg-slate-100 bg-white text-slate-700'
                        }`}
                        onClick={() => toggleArrayItem('dislikedSubjects', sub)}
                      >
                        {isSelected && <Check className="h-3 w-3 mr-1 inline" />}
                        {sub}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-4 bg-slate-50/50">
              <Button variant="outline" onClick={() => setStep(1)} className="text-xs gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold gap-2">
                Next: Learning & Work Style <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {/* STEP 3: Work & Learning Styles */}
        {step === 3 && (
          <>
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <Target className="h-4 w-4" />
                <span>Learning & Work Style</span>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">Step 3: Work Preferences</CardTitle>
              <CardDescription>How do you learn best and where do you see yourself working?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Preferred Learning Style</Label>
                <Select
                  value={formData.learningStyle}
                  onValueChange={(val) => setFormData({ ...formData, learningStyle: val })}
                >
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRACTICAL_HANDS_ON">Practical & Hands-On (Workshops, coding, experiments)</SelectItem>
                    <SelectItem value="THEORETICAL">Conceptual & Academic (Deep textbook reading, theory, analysis)</SelectItem>
                    <SelectItem value="VISUAL">Visual & Creative (Diagrams, prototypes, sketching, media)</SelectItem>
                    <SelectItem value="COLLABORATIVE">Collaborative & People-Centric (Group projects, debate, discussions)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Ideal Work Environment</Label>
                <Select
                  value={formData.workEnvironment}
                  onValueChange={(val) => setFormData({ ...formData, workEnvironment: val })}
                >
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECH_OFFICE">Tech Office / Digital Product Firm (Software, AI, systems)</SelectItem>
                    <SelectItem value="HOSPITAL_LAB">Hospital / Clinical Laboratory (Patient healthcare, medical research)</SelectItem>
                    <SelectItem value="CORPORATE">Corporate Boardroom (Finance, banking, management, consulting)</SelectItem>
                    <SelectItem value="CREATIVE_STUDIO">Creative Studio (UI/UX design, architecture, animation, media)</SelectItem>
                    <SelectItem value="DISTRICT_ADMIN">Government Collectorate / Courtroom (Civil services, judiciary, law)</SelectItem>
                    <SelectItem value="FIELD_SITE">Field Site / Defence Base / Industrial Plant (Aviation, military, engineering)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Career Domains That Interest You (Select 2–4):</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CAREER_DOMAIN_OPTIONS.map((domain) => {
                    const isSelected = formData.careerInterests.includes(domain.id)
                    return (
                      <div
                        key={domain.id}
                        onClick={() => toggleArrayItem('careerInterests', domain.id)}
                        className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition select-none flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{domain.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-4 bg-slate-50/50">
              <Button variant="outline" onClick={() => setStep(2)} className="text-xs gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button onClick={() => setStep(4)} className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold gap-2">
                Next: Budget & College Preferences <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {/* STEP 4: Budget & Feasibility */}
        {step === 4 && (
          <>
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <Building className="h-4 w-4" />
                <span>Budget & College Preferences</span>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">Step 4: Feasibility Constraints</CardTitle>
              <CardDescription>Tell us about your college fee budget and study location preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Preferred College Location</Label>
                <Select
                  value={formData.preferredStudyLocation}
                  onValueChange={(val) => setFormData({ ...formData, preferredStudyLocation: val })}
                >
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOME_STATE">Home State Only (Nearby local colleges)</SelectItem>
                    <SelectItem value="ANY_INDIA">Anywhere in India (IITs, NITs, AIIMS, Central Varsities)</SelectItem>
                    <SelectItem value="ABROAD">Open to Global / Studying Abroad</SelectItem>
                    <SelectItem value="FLEXIBLE">Flexible / Undecided</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Annual College Fee Budget</Label>
                <Select
                  value={formData.budgetPreference}
                  onValueChange={(val) => setFormData({ ...formData, budgetPreference: val })}
                >
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOVERNMENT_ONLY">Government Colleges Preferred (Lowest fee: &lt; ₹50,000/yr)</SelectItem>
                    <SelectItem value="BUDGET_FRIENDLY">Budget Friendly (₹50,000 – ₹1.5 Lakhs/yr)</SelectItem>
                    <SelectItem value="MODERATE">Moderate Fee (₹1.5 – ₹4 Lakhs/yr)</SelectItem>
                    <SelectItem value="NO_CONSTRAINT">No Specific Constraint / Open to Private Universities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Institution Type Preference</Label>
                <Select
                  value={formData.govtPrivatePref}
                  onValueChange={(val) => setFormData({ ...formData, govtPrivatePref: val })}
                >
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANY">Any Good Accredited Institution</SelectItem>
                    <SelectItem value="GOVERNMENT_PREFERRED">Government / National Institutes of Importance (IIT/NIT/AIIMS/DU)</SelectItem>
                    <SelectItem value="PRIVATE_PREFERRED">Top Private Universities (BITS, Manipal, Symbiosis, Christ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-4 bg-slate-50/50">
              <Button variant="outline" onClick={() => setStep(3)} className="text-xs gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold gap-2 shadow-md"
              >
                {loading ? 'Saving Profile...' : 'Save Profile & Begin Assessment'}
                <Sparkles className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
