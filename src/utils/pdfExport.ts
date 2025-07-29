import jsPDF from 'jspdf'

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
    successProbability?: number
  }
}

export const generateRoadmapPDF = async (data: RoadmapData): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20

    // Helper function to add text with word wrap and return new Y position
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
      if (!text || typeof text !== 'string') return y
      
      const sanitizedText = String(text)
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      if (!sanitizedText) return y
      
      pdf.setFontSize(fontSize)
      const lines = pdf.splitTextToSize(sanitizedText, maxWidth)
      pdf.text(lines, x, y)
      return y + (lines.length * fontSize * 0.4)
    }

    // Check if we need a new page
    const checkNewPage = (currentY: number, requiredSpace: number = 30): number => {
      if (currentY + requiredSpace > pageHeight - margin) {
        pdf.addPage()
        return margin
      }
      return currentY
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
    const userName = data.userProfile?.name || 'Professional'
    pdf.text(userName, pageWidth/2, 120, { align: 'center' })
    
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    const targetField = data.userProfile?.targetField || 'Target Role'
    const targetSalary = data.userProfile?.targetSalary || 75
    pdf.text(`${targetField} • $${targetSalary}/hour`, pageWidth/2, 130, { align: 'center' })

    // Score Circle
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(3)
    pdf.circle(pageWidth/2, 160, 25)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    const currentScore = data.userProfile?.currentScore || 0
    pdf.text(`${currentScore}%`, pageWidth/2, 165, { align: 'center' })
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
    if (data.analysis?.strengths && data.analysis.strengths.length > 0) {
      currentY = checkNewPage(currentY, 40)
      
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Your Key Strengths', margin, currentY)
      currentY += 10

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      data.analysis.strengths.forEach((strength) => {
        currentY = checkNewPage(currentY, 15)
        pdf.setFillColor(255, 215, 0)
        pdf.circle(margin + 3, currentY - 2, 1.5, 'F')
        currentY = addWrappedText(strength, margin + 8, currentY, pageWidth - margin * 2 - 8)
        currentY += 5
      })
      currentY += 10
    }

    // Gaps Section
    if (data.analysis?.gaps && data.analysis.gaps.length > 0) {
      currentY = checkNewPage(currentY, 40)
      
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Skill Gaps to Address', margin, currentY)
      currentY += 10

      data.analysis.gaps.forEach((gap) => {
        currentY = checkNewPage(currentY, 25)

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        const gapTitle = `${gap.skill || 'Skill Gap'} (${gap.impact || 'Medium'} Impact)`
        currentY = addWrappedText(gapTitle, margin, currentY, pageWidth - margin * 2, 12)
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(100, 100, 100)
        const timeText = `Time to acquire: ${gap.timeToAcquire || 'TBD'}`
        currentY = addWrappedText(timeText, margin, currentY, pageWidth - margin * 2)
        
        if (gap.description) {
          currentY = addWrappedText(gap.description, margin, currentY, pageWidth - margin * 2)
        }
        
        currentY += 8
        pdf.setTextColor(0, 0, 0)
      })
    }

    // Page 3+: Roadmap
    pdf.addPage()
    currentY = margin

    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Your Personalized Career Roadmap', margin, currentY)
    currentY += 15

    // Roadmap Summary
    if (data.roadmap?.estimatedImprovement) {
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      const improvementText = `Estimated Score Improvement: +${data.roadmap.estimatedImprovement}%`
      currentY = addWrappedText(improvementText, margin, currentY, pageWidth - margin * 2, 12)
      
      if (data.roadmap.successProbability) {
        const probabilityText = `Success Probability: ${data.roadmap.successProbability}%`
        currentY = addWrappedText(probabilityText, margin, currentY, pageWidth - margin * 2, 12)
      }
      currentY += 15
    }

    // Roadmap Phases
    if (data.roadmap?.phases && data.roadmap.phases.length > 0) {
      data.roadmap.phases.forEach((phase, phaseIndex) => {
        currentY = checkNewPage(currentY, 60)

        // Phase Header
        pdf.setFillColor(255, 215, 0)
        pdf.rect(margin, currentY - 8, pageWidth - margin * 2, 12, 'F')
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        const phaseTitle = phase.phase || `Phase ${phaseIndex + 1}`
        pdf.text(phaseTitle, margin + 5, currentY)
        currentY += 15

        // Goals
        if (phase.goals && phase.goals.length > 0) {
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'bold')
          pdf.text('Goals:', margin, currentY)
          currentY += 8

          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          phase.goals.forEach(goal => {
            currentY = checkNewPage(currentY, 10)
            pdf.setFillColor(0, 0, 0)
            pdf.circle(margin + 3, currentY - 2, 1, 'F')
            currentY = addWrappedText(goal, margin + 8, currentY, pageWidth - margin * 2 - 8)
            currentY += 3
          })
          currentY += 5
        }

        // Actions
        if (phase.actions && phase.actions.length > 0) {
          currentY = checkNewPage(currentY, 30)
          
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'bold')
          pdf.text('Action Items:', margin, currentY)
          currentY += 8

          phase.actions.forEach(action => {
            currentY = checkNewPage(currentY, 20)

            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'bold')
            const actionText = `• ${action.action || 'Action item'}`
            currentY = addWrappedText(actionText, margin, currentY, pageWidth - margin * 2)
            
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(100, 100, 100)
            const detailsText = `  Time: ${action.timeRequired || 'TBD'} | Priority: ${action.priority || 'Medium'}`
            currentY = addWrappedText(detailsText, margin, currentY, pageWidth - margin * 2)
            
            if (action.resources && action.resources.length > 0) {
              const resourcesText = `  Resources: ${action.resources.join(', ')}`
              currentY = addWrappedText(resourcesText, margin, currentY, pageWidth - margin * 2)
            }
            
            currentY += 5
            pdf.setTextColor(0, 0, 0)
          })
        }

        currentY += 10
      })
    }

    // Milestones Page
    if (data.roadmap?.milestones && data.roadmap.milestones.length > 0) {
      pdf.addPage()
      currentY = margin

      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Key Milestones & Timeline', margin, currentY)
      currentY += 15

      data.roadmap.milestones.forEach((milestone, index) => {
        currentY = checkNewPage(currentY, 25)
        
        pdf.setFillColor(255, 215, 0)
        pdf.circle(margin + 5, currentY - 2, 3, 'F')
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        const milestoneText = milestone.milestone || `Milestone ${index + 1}`
        currentY = addWrappedText(milestoneText, margin + 15, currentY, pageWidth - margin * 2 - 15, 12)
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(100, 100, 100)
        const timelineText = `Deadline: ${milestone.deadline || 'TBD'} | Impact: ${milestone.scoreImpact || '+5%'}`
        currentY = addWrappedText(timelineText, margin + 15, currentY, pageWidth - margin * 2 - 15)
        
        currentY += 10
        pdf.setTextColor(0, 0, 0)
      })
    }

    // Final Summary Page
    pdf.addPage()
    currentY = margin

    pdf.setFillColor(255, 215, 0)
    pdf.rect(0, 0, pageWidth, 60, 'F')
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Next Steps & Recommendations', margin, 35)

    currentY = 80

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(0, 0, 0)

    const recommendations = [
      '1. Focus on high-impact skill gaps first to maximize improvement',
      '2. Build a portfolio of projects demonstrating your new capabilities',
      '3. Network with professionals in your target field',
      '4. Consider relevant certifications to validate your skills',
      '5. Practice interviewing and articulating your value proposition',
      '6. Track your progress and update your resume regularly'
    ]

    recommendations.forEach(rec => {
      currentY = addWrappedText(rec, margin, currentY, pageWidth - margin * 2, 12)
      currentY += 8
    })

    currentY += 20

    // Footer
    pdf.setFillColor(0, 0, 0)
    pdf.rect(0, pageHeight - 40, pageWidth, 40, 'F')
    
    pdf.setTextColor(255, 215, 0)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('NOVA - Navigate • Optimize • Validate • Achieve', pageWidth/2, pageHeight - 20, { align: 'center' })
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Your AI-Powered Career Intelligence Platform', pageWidth/2, pageHeight - 10, { align: 'center' })

    // Generate filename
    const filename = `NOVA-Career-Report-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
    
    // Save the PDF
    pdf.save(filename)
    
    console.log('PDF generated successfully:', filename)
    
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error('Failed to generate PDF report. Please try again.')
  }
}