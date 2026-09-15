'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other'
]

const SUBJECT_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English', 'History', 'Geography', 'Economics', 'Accountancy', 'Art', 'Physical Education'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    studentName: '',
    age: 15,
    currentClass: '10th',
    board: 'CBSE',
    state: 'Maharashtra',
    city: '',
    percentageObtained: 75,
    isPercentageExpected: true,
    strongSubjects: [] as string[],
    enjoyedSubjects: [] as string[],
    dislikedSubjects: [] as string[],
    preferredStudyLocation: 'HOME_STATE',
    budgetPreference: 'BUDGET_FRIENDLY',
    wantsHigherEducation: true,
    careerInterests: [] as string[],
  })

  const toggleSubject = (field: 'strongSubjects' | 'enjoyedSubjects' | 'dislikedSubjects', subject: string) => {
    setFormData((prev) => {
      const current = prev[field]
      const updated = current.includes(subject)
        ? current.filter((s) => s !== subject)
        : [...current, subject]
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
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8 text-center space-y-2">
        <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700">
          <Sparkles className="h-3.5 w-3.5" />
          Step {step} of 3
        </Badge>
        <h1 className="text-3xl font-bold text-slate-900">Build Your Student Profile</h1>
        <p className="text-slate-600 text-sm">
          This helps SmartCareer contextualize assessment recommendations for your background.
        </p>
        <Progress value={(step / 3) * 100} className="h-2 max-w-md mx-auto mt-4" />
      </div>

      <Card className="shadow-md border-slate-200">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="text-xl">Step 1: Personal & Education Details</CardTitle>
              <CardDescription>Tell us a bit about your current school background.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="studentName">Your Full Name *</Label>
                <Input
                  id="studentName"
                  placeholder="e.g. Priya Sharma"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentClass">Current Class</Label>
                  <Select
                    value={formData.currentClass}
                    onValueChange={(val) => setFormData({ ...formData, currentClass: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10th">Currently in 10th</SelectItem>
                      <SelectItem value="10th_completed">Just Completed 10th</SelectItem>
                      <SelectItem value="9th">Currently in 9th</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="board">School Board</Label>
                  <Select
                    value={formData.board}
                    onValueChange={(val) => setFormData({ ...formData, board: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE / CISCE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="IB">IB / Cambridge</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(val) => setFormData({ ...formData, state: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((st) => (
                        <SelectItem key={st} value={st}>{st}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city">City / District</Label>
                  <Input
                    id="city"
                    placeholder="e.g. Pune"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t pt-4">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.studentName.trim()}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-xl">Step 2: Marks & Subject Interests</CardTitle>
              <CardDescription>Select the subjects you excel at and enjoy most.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="percentage">10th Percentage / Score (%): {formData.percentageObtained}%</Label>
                <Input
                  id="percentage"
                  type="number"
                  min="35"
                  max="100"
                  value={formData.percentageObtained}
                  onChange={(e) => setFormData({ ...formData, percentageObtained: Number(e.target.value) })}
                />
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="isExpected"
                    checked={formData.isPercentageExpected}
                    onCheckedChange={(val) => setFormData({ ...formData, isPercentageExpected: !!val })}
                  />
                  <Label htmlFor="isExpected" className="text-xs text-slate-600 font-normal">
                    This is an expected / projected percentage score
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects You Enjoy Most (Select 2–4):</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = formData.enjoyedSubjects.includes(sub)
                    return (
                      <Badge
                        key={sub}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer py-1.5 px-3 text-xs transition ${
                          isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'
                        }`}
                        onClick={() => toggleSubject('enjoyedSubjects', sub)}
                      >
                        {isSelected && <Check className="h-3 w-3 mr-1 inline" />}
                        {sub}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 gap-2">
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="text-xl">Step 3: Study Preferences & Goals</CardTitle>
              <CardDescription>Tell us about your college location and financial preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Preferred Study Location</Label>
                <Select
                  value={formData.preferredStudyLocation}
                  onValueChange={(val) => setFormData({ ...formData, preferredStudyLocation: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOME_STATE">Home State Only</SelectItem>
                    <SelectItem value="ANY_INDIA">Anywhere in India</SelectItem>
                    <SelectItem value="ABROAD">Open to Studying Abroad</SelectItem>
                    <SelectItem value="FLEXIBLE">Flexible / Undecided</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>College Fee / Budget Preference</Label>
                <Select
                  value={formData.budgetPreference}
                  onValueChange={(val) => setFormData({ ...formData, budgetPreference: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOVERNMENT_ONLY">Government Colleges Preferred (Lowest fee)</SelectItem>
                    <SelectItem value="BUDGET_FRIENDLY">Budget Friendly (&lt; ₹1 Lakh/year)</SelectItem>
                    <SelectItem value="MODERATE">Moderate Fee (₹1–3 Lakhs/year)</SelectItem>
                    <SelectItem value="NO_CONSTRAINT">No Specific Constraint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 gap-2">
                {loading ? 'Saving Profile...' : 'Save & Begin Assessment'}
                <Sparkles className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
