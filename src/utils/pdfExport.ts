import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface RoadmapData {
  userProfile: {
    name: string
    targetField: string
    targetSalary: number
    currentScore: number
  }
  analysis: {
    strengths: string[]
    gaps: Array<{
      skill: string
      impact: string
      timeToAcquire: string
      description?: string
    }>
  }
  roadmap: {
    phases: Array<{
      phase: string
      goals: string[]
      actions: Array<{
        action: string
        timeRequired: string
        priority: string
        resources: string[]
      }>
    }>
    milestones: Array<{
      milestone: string
      deadline: string
      scoreImpact: string
    }>
    estimatedImprovement: number
  }
}

export const generateRoadmapPDF = async (data: RoadmapData): Promise<void> => {
  try {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20

  // Colors
  const primaryColor = '#000000'
  const accentColor = '#FFD700'
  const grayColor = '#6B7280'

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    if (!text) return y;
    pdf.setFontSize(fontSize)
    const lines = pdf.splitTextToSize(text, maxWidth)
    pdf.text(lines, x, y)
    return y + (lines.length * fontSize * 0.4)
  }

  // Page 1: Cover Page
  pdf.setFillColor(255, 215, 0) // Yellow background
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  // NOVA Logo
  pdf.setFillColor(0, 0, 0)
  pdf.roundedRect(pageWidth/2 - 15, 40, 30, 30, 5, 5, 'F')
  pdf.setTextColor(255, 215, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('N', pageWidth/2, 60, { align: 'center' })

  // Title
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(32)
  pdf.setFont('helvetica', 'bold')
  pdf.text('NOVA', pageWidth/2, 85, { align: 'center' })
  
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Career Intelligence Report', pageWidth/2, 95, { align: 'center' })

  // User Info
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${data.userProfile.name || 'User'}`, pageWidth/2, 120, { align: 'center' })
  
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${data.userProfile.targetField} • $${data.userProfile.targetSalary}/hour`, pageWidth/2, 130, { align: 'center' })

  // Score Circle (simplified)
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(3)
  pdf.circle(pageWidth/2, 160, 25)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${data.userProfile.currentScore}%`, pageWidth/2, 165, { align: 'center' })
  pdf.setFontSize(10)
  pdf.text('Current Match Score', pageWidth/2, 175, { align: 'center' })

  // Date
  pdf.setFontSize(10)
  pdf.setTextColor(60, 60, 60)
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth/2, 220, { align: 'center' })

  // Page 2: Analysis Summary
  pdf.addPage()
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  let currentY = margin

  // Header
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Career Analysis Summary', margin, currentY)
  currentY += 15

  // Strengths Section
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Your Strengths', margin, currentY)
  currentY += 10

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  (data.analysis.strengths || []).forEach((strength, index) => {
    pdf.setFillColor(255, 215, 0)
    pdf.circle(margin + 3, currentY - 2, 1.5, 'F')
    currentY = addWrappedText(strength, margin + 8, currentY, pageWidth - margin * 2 - 8)
    currentY += 3
  })

  currentY += 10

  // Gaps Section
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Skill Gaps to Address', margin, currentY)
  currentY += 10

  (data.analysis.gaps || []).forEach((gap, index) => {
    if (currentY > pageHeight - 40) {
      pdf.addPage()
      currentY = margin
    }

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    currentY = addWrappedText(`${gap.skill} (${gap.impact} Impact)`, margin, currentY, pageWidth - margin * 2, 12)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    currentY = addWrappedText(`Time to acquire: ${gap.timeToAcquire}`, margin, currentY, pageWidth - margin * 2)
    
    if (gap.description) {
      currentY = addWrappedText(gap.description, margin, currentY, pageWidth - margin * 2)
    }
    
    currentY += 8
    pdf.setTextColor(0, 0, 0)
  })

  // Page 3+: Roadmap
  pdf.addPage()
  currentY = margin

  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Your Personalized Roadmap', margin, currentY)
  currentY += 15

  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  currentY = addWrappedText(`Estimated Score Improvement: +${data.roadmap.estimatedImprovement || 0}%`, margin, currentY, pageWidth - margin * 2, 12)
  currentY += 15

  (data.roadmap.phases || []).forEach((phase, phaseIndex) => {
    if (currentY > pageHeight - 60) {
      pdf.addPage()
      currentY = margin
    }

    // Phase Header
    pdf.setFillColor(255, 215, 0)
    pdf.rect(margin, currentY - 8, pageWidth - margin * 2, 12, 'F')
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(phase.phase, margin + 5, currentY)
    currentY += 15

    // Goals
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Goals:', margin, currentY)
    currentY += 8

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    (phase.goals || []).forEach(goal => {
      pdf.setFillColor(0, 0, 0)
      pdf.circle(margin + 3, currentY - 2, 1, 'F')
      currentY = addWrappedText(goal, margin + 8, currentY, pageWidth - margin * 2 - 8)
      currentY += 3
    })

    currentY += 5

    // Actions
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Action Items:', margin, currentY)
    currentY += 8

    (phase.actions || []).forEach(action => {
      if (currentY > pageHeight - 30) {
        pdf.addPage()
        currentY = margin
      }

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      currentY = addWrappedText(`• ${action.action}`, margin, currentY, pageWidth - margin * 2)
      
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      currentY = addWrappedText(`  Time: ${action.timeRequired} | Priority: ${action.priority}`, margin, currentY, pageWidth - margin * 2)
      
      if (action.resources && action.resources.length > 0) {
        currentY = addWrappedText(`  Resources: ${action.resources.join(', ')}`, margin, currentY, pageWidth - margin * 2)
      }
      
      currentY += 5
      pdf.setTextColor(0, 0, 0)
    })

    currentY += 10
  })

  // Milestones Page
  if (data.roadmap.milestones && data.roadmap.milestones.length > 0) {
    pdf.addPage()
    currentY = margin

    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Key Milestones', margin, currentY)
    currentY += 15

    data.roadmap.milestones.forEach((milestone, index) => {
      if (currentY > pageHeight - 30) {
        pdf.addPage()
        currentY = margin
      }
      
      pdf.setFillColor(255, 215, 0)
      pdf.circle(margin + 5, currentY - 2, 3, 'F')
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      currentY = addWrappedText(milestone.milestone, margin + 15, currentY, pageWidth - margin * 2 - 15, 12)
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      currentY = addWrappedText(`Deadline: ${milestone.deadline} | Impact: ${milestone.scoreImpact}`, margin + 15, currentY, pageWidth - margin * 2 - 15)
      
      currentY += 10
      pdf.setTextColor(0, 0, 0)
    })
  }

  // Save the PDF
  pdf.save(`NOVA-Career-Roadmap-${(data.userProfile.name || 'User').replace(/\s+/g, '-')}.pdf`)
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
  }
}