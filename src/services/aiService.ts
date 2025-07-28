interface ResumeAnalysis {
  extractedSkills: {
    technical: string[];
    frameworks: string[];
    tools: string[];
    languages: string[];
  };
  experienceYears: number;
  educationLevel: string;
  certifications: string[];
  matchScore: number;
  strengths: string[];
  gaps: Array<{
    skill: string;
    impact: 'High' | 'Medium' | 'Low';
    timeToAcquire: string;
    description?: string;
  }>;
  marketPosition: string;
}

interface JobMatch {
  jobTitle: string;
  companyName: string;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  jobType: string;
  requiredSkills: string[];
  jobDescription: string;
  applicationUrl: string;
  matchScore: number;
  matchReason: string;
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private isConfigured: boolean;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.isConfigured = this.apiKey && this.apiKey !== 'your-openai-api-key-here' && this.apiKey.startsWith('sk-');
    
    if (!this.isConfigured) {
      console.warn('OpenAI API key not properly configured. Using mock analysis.');
    }
  }

  private generateMockAnalysis(resumeText: string, targetField: string, targetSalary: number): ResumeAnalysis {
    // Enhanced mock analysis based on resume content and target field
    const words = resumeText.toLowerCase().split(/\s+/);
    
    // Enhanced field relevance scoring
    const fieldRelevanceScore = this.calculateFieldRelevance(words, targetField);
    
    // Extract skills based on common keywords
    const technicalSkills = [];
    const frameworks = [];
    const tools = [];
    const languages = [];

    // Common technical skills
    const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'git'];
    const frameworkKeywords = ['react', 'angular', 'vue', 'express', 'django', 'spring', 'laravel', 'rails'];
    const toolKeywords = ['git', 'docker', 'jenkins', 'jira', 'figma', 'photoshop', 'excel', 'tableau'];
    const languageKeywords = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese'];

    techKeywords.forEach(skill => {
      if (words.some(word => word.includes(skill))) {
        technicalSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });

    frameworkKeywords.forEach(framework => {
      if (words.some(word => word.includes(framework))) {
        frameworks.push(framework.charAt(0).toUpperCase() + framework.slice(1));
      }
    });

    toolKeywords.forEach(tool => {
      if (words.some(word => word.includes(tool))) {
        tools.push(tool.charAt(0).toUpperCase() + tool.slice(1));
      }
    });

    languageKeywords.forEach(lang => {
      if (words.some(word => word.includes(lang))) {
        languages.push(lang.charAt(0).toUpperCase() + lang.slice(1));
      }
    });

    // Estimate experience based on resume content
    const experienceIndicators = ['years', 'experience', 'senior', 'lead', 'manager', 'director'];
    const experienceYears = Math.min(10, Math.max(1, experienceIndicators.reduce((acc, indicator) => {
      return acc + (words.filter(word => word.includes(indicator)).length * 2);
    }, 2)));

    // Calculate match score based on field alignment
    const fieldKeywords = targetField.toLowerCase().split(/\s+/);
    const fieldMatches = fieldKeywords.reduce((acc, keyword) => {
      return acc + (words.filter(word => word.includes(keyword)).length * 10);
    }, 0);
    
    // Use field relevance as primary factor
    const baseScore = Math.min(95, Math.max(15, fieldRelevanceScore + fieldMatches + (technicalSkills.length * 2)));
    const salaryAdjustment = targetSalary > 100 ? -10 : targetSalary < 50 ? 10 : 0;
    const matchScore = Math.max(15, Math.min(95, baseScore + salaryAdjustment));

    // Generate relevant gaps based on target field
    const commonGaps = this.generateFieldSpecificGaps(targetField, technicalSkills, frameworks);

    return {
      extractedSkills: {
        technical: technicalSkills.length > 0 ? technicalSkills : ['JavaScript', 'HTML', 'CSS'],
        frameworks: frameworks.length > 0 ? frameworks : ['React'],
        tools: tools.length > 0 ? tools : ['Git', 'VS Code'],
        languages: languages.length > 0 ? languages : ['English']
      },
      experienceYears,
      educationLevel: words.some(w => w.includes('master') || w.includes('mba')) ? 'Masters' : 
                     words.some(w => w.includes('bachelor') || w.includes('degree')) ? 'Bachelors' : 'High School',
      certifications: words.filter(w => w.includes('certified') || w.includes('certification')).slice(0, 3),
      matchScore,
      strengths: this.generateStrengths(targetField, technicalSkills, experienceYears),
      gaps: commonGaps,
      marketPosition: matchScore > 80 ? 'Excellent' : matchScore > 60 ? 'Good' : 'Needs Improvement'
    };
  }

  private calculateFieldRelevance(resumeWords: string[], targetField: string): number {
    const field = targetField.toLowerCase();
    
    // Define field-specific keywords and their weights
    const fieldKeywords = this.getFieldKeywords(field);
    const irrelevantFields = this.getIrrelevantFields(field);
    
    // Check for completely irrelevant fields (auto low score)
    const irrelevantMatches = irrelevantFields.reduce((count, irrelevantField) => {
      return count + resumeWords.filter(word => word.includes(irrelevantField)).length;
    }, 0);
    
    // If resume shows strong expertise in irrelevant field, score below 25
    if (irrelevantMatches > 5) {
      return Math.random() * 20 + 5; // 5-25 range
    }
    
    // Calculate relevance based on field-specific keywords
    const relevantMatches = fieldKeywords.reduce((count, keyword) => {
      return count + resumeWords.filter(word => word.includes(keyword)).length;
    }, 0);
    
    // Base score calculation
    if (relevantMatches > 15) return 75 + Math.random() * 20; // 75-95 range
    if (relevantMatches > 10) return 55 + Math.random() * 20; // 55-75 range  
    if (relevantMatches > 5) return 35 + Math.random() * 20;  // 35-55 range
    return 15 + Math.random() * 20; // 15-35 range
  }
  
  private getFieldKeywords(field: string): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'data': ['data', 'analytics', 'python', 'sql', 'tableau', 'statistics', 'machine', 'learning', 'pandas', 'numpy', 'visualization'],
      'software': ['software', 'programming', 'javascript', 'react', 'node', 'java', 'python', 'git', 'api', 'database', 'frontend', 'backend'],
      'developer': ['developer', 'programming', 'javascript', 'react', 'node', 'java', 'python', 'git', 'api', 'database', 'frontend', 'backend'],
      'engineer': ['engineer', 'programming', 'javascript', 'react', 'node', 'java', 'python', 'git', 'api', 'database', 'system', 'architecture'],
      'product': ['product', 'management', 'roadmap', 'agile', 'scrum', 'stakeholder', 'strategy', 'user', 'requirements', 'analytics'],
      'marketing': ['marketing', 'digital', 'seo', 'content', 'social', 'campaign', 'analytics', 'brand', 'advertising', 'email'],
      'design': ['design', 'ux', 'ui', 'figma', 'sketch', 'adobe', 'prototype', 'wireframe', 'user', 'interface', 'visual'],
      'finance': ['finance', 'financial', 'accounting', 'excel', 'modeling', 'budget', 'analysis', 'investment', 'accounting', 'reporting'],
      'sales': ['sales', 'business', 'development', 'crm', 'salesforce', 'lead', 'negotiation', 'account', 'revenue', 'client']
    };
    
    // Find matching keywords for the field
    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (field.includes(key)) {
        return keywords;
      }
    }
    
    return field.split(/\s+/); // Fallback to field words
  }
  
  private getIrrelevantFields(targetField: string): string[] {
    const field = targetField.toLowerCase();
    
    const irrelevantMap: { [key: string]: string[] } = {
      'data': ['construction', 'civil', 'mechanical', 'electrical', 'plumbing', 'carpentry', 'welding', 'painting', 'interior', 'architecture'],
      'software': ['construction', 'civil', 'mechanical', 'plumbing', 'carpentry', 'welding', 'painting', 'interior', 'chef', 'cooking'],
      'developer': ['construction', 'civil', 'mechanical', 'plumbing', 'carpentry', 'welding', 'painting', 'interior', 'chef', 'cooking'],
      'engineer': ['chef', 'cooking', 'painting', 'interior', 'fashion', 'retail', 'hospitality', 'restaurant'],
      'product': ['construction', 'civil', 'mechanical', 'plumbing', 'carpentry', 'welding', 'chef', 'cooking'],
      'marketing': ['construction', 'civil', 'mechanical', 'plumbing', 'carpentry', 'welding', 'programming', 'coding'],
      'design': ['construction', 'civil', 'mechanical', 'plumbing', 'carpentry', 'welding', 'programming', 'coding'],
      'finance': ['construction', 'civil', 'mechanical', 'plumbing', 'carpentry', 'welding', 'programming', 'coding'],
      'sales': ['construction', 'civil', 'mechanical', 'plumbing', 'carpentry', 'welding', 'programming', 'coding']
    };
    
    // Find irrelevant fields for the target field
    for (const [key, irrelevantFields] of Object.entries(irrelevantMap)) {
      if (field.includes(key)) {
        return irrelevantFields;
      }
    }
    
    return []; // No specific irrelevant fields identified
  }

  private generateFieldSpecificGaps(targetField: string, currentSkills: string[], frameworks: string[]): Array<{
    skill: string;
    impact: 'High' | 'Medium' | 'Low';
    timeToAcquire: string;
    description: string;
  }> {
    const field = targetField.toLowerCase();
    const gaps = [];

    if (field.includes('developer') || field.includes('engineer')) {
      if (!currentSkills.some(s => s.toLowerCase().includes('cloud'))) {
        gaps.push({
          skill: 'Cloud Computing (AWS/Azure)',
          impact: 'High' as const,
          timeToAcquire: '2-3 months',
          description: 'Cloud skills are essential for modern development roles and significantly increase market value.'
        });
      }
      if (!frameworks.some(f => f.toLowerCase().includes('react'))) {
        gaps.push({
          skill: 'Modern Frontend Framework',
          impact: 'High' as const,
          timeToAcquire: '1-2 months',
          description: 'React, Vue, or Angular knowledge is crucial for frontend development positions.'
        });
      }
    }

    if (field.includes('data') || field.includes('analyst')) {
      gaps.push({
        skill: 'Advanced SQL & Database Design',
        impact: 'High' as const,
        timeToAcquire: '1-2 months',
        description: 'Advanced database skills are fundamental for data roles and analytics positions.'
      });
      gaps.push({
        skill: 'Python for Data Science',
        impact: 'High' as const,
        timeToAcquire: '2-3 months',
        description: 'Python with pandas, numpy, and scikit-learn is essential for data analysis roles.'
      });
    }

    if (field.includes('product') || field.includes('manager')) {
      gaps.push({
        skill: 'Agile/Scrum Certification',
        impact: 'Medium' as const,
        timeToAcquire: '2-4 weeks',
        description: 'Agile methodologies are standard in product management and team leadership roles.'
      });
    }

    return gaps.slice(0, 3); // Return top 3 gaps
  }

  private generateStrengths(targetField: string, skills: string[], experience: number): string[] {
    const strengths = [];
    
    if (experience > 5) {
      strengths.push(`${experience}+ years of proven industry experience with demonstrated impact`);
    }
    
    if (skills.length > 5) {
      strengths.push(`Versatile technical foundation spanning ${skills.length} core technologies and frameworks`);
    }
    
    const field = targetField.toLowerCase();
    if (field.includes('developer') || field.includes('engineer')) {
      strengths.push('Strong problem-solving abilities with hands-on development experience');
      strengths.push('Technical architecture understanding and code quality focus');
    } else if (field.includes('data')) {
      strengths.push('Analytical mindset with quantitative problem-solving approach');
      strengths.push('Experience with data interpretation and insight generation');
    } else if (field.includes('product') || field.includes('manager')) {
      strengths.push('Strategic thinking with user-focused product development approach');
      strengths.push('Cross-functional collaboration and stakeholder management experience');
    } else {
      strengths.push(`Solid foundation in ${targetField} domain knowledge and best practices`);
      strengths.push('Adaptable professional with continuous learning mindset');
    }
    
    if (targetField.toLowerCase().includes('senior') || targetField.toLowerCase().includes('lead')) {
      strengths.push('Leadership readiness with mentoring and team guidance capabilities');
    }

    return strengths.slice(0, 5); // Return up to 5 strengths for comprehensive analysis
  }

  async analyzeResume(
    resumeText: string,
    targetField: string,
    targetSalary: number
  ): Promise<ResumeAnalysis> {
    // If API is not configured, use enhanced mock analysis
    if (!this.isConfigured) {
      console.log('Using enhanced mock analysis...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      return this.generateMockAnalysis(resumeText, targetField, targetSalary);
    }

    const prompt = `
    You are an expert career analyst. Analyze this resume for a "${targetField}" role targeting $${targetSalary}/hour.
    
    CRITICAL SCORING REQUIREMENT: If this resume shows expertise in a completely different field (e.g., construction/civil engineering for software roles, creative arts for finance, etc.), the match score MUST be below 25.
    
    First, assess field relevance:
    - 0-25: Completely irrelevant field (construction resume for data science, etc.)
    - 26-50: Minimal relevance with some transferable skills  
    - 51-75: Moderate relevance with several matching qualifications
    - 76-100: High relevance with strong alignment

    RESUME:
    ${resumeText}

    Provide a comprehensive analysis in this exact JSON format:
    {
      "extractedSkills": {
        "technical": ["list all technical skills found"],
        "frameworks": ["list all frameworks/libraries found"],
        "tools": ["list all tools and software mentioned"],
        "languages": ["programming languages and spoken languages"]
      },
      "experienceYears": "estimated years of experience",
      "educationLevel": "highest education level",
      "certifications": ["list all certifications mentioned"],
      "matchScore": "percentage match for the target role (0-100)",
      "strengths": ["key strengths that align with the target role"],
      "gaps": [
        {
          "skill": "specific missing skill or qualification",
          "impact": "High|Medium|Low",
          "timeToAcquire": "realistic timeframe to acquire",
          "description": "detailed explanation of why this is important for the role"
        }
      ],
      "marketPosition": "assessment relative to market expectations for this role and salary"
    }

    Be extremely thorough and consider:
    1. What does a "${targetField}" role typically require?
    2. Is this resume from a completely different field? (If yes, score below 25)
    3. How does this resume match the role requirements?
    4. How realistic is the $${targetSalary}/hour target for this profile?
    `;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        console.warn('OpenAI API failed, falling back to mock analysis');
        return this.generateMockAnalysis(resumeText, targetField, targetSalary);
      }

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);
      
      return analysis;
    } catch (error) {
      console.warn('OpenAI API error, using mock analysis:', error);
      return this.generateMockAnalysis(resumeText, targetField, targetSalary);
    }
  }

  async generateRoadmap(
    analysis: ResumeAnalysis,
    targetField: string,
    targetSalary: number,
    timeframe: '3-month' | '6-month' = '6-month'
  ): Promise<any> {
    // Generate comprehensive roadmap based on analysis
    const generateComprehensiveRoadmap = () => ({
      timeline: timeframe,
      phases: [
        {
          phase: "Phase 1: Skill Foundation & Gap Closure (Month 1-2)",
          goals: [
            `Master ${analysis.gaps.slice(0, 2).map(g => g.skill).join(' and ')} to close critical gaps`,
            `Build 2-3 portfolio projects demonstrating ${targetField} expertise`,
            "Establish strong LinkedIn presence and professional network",
            "Complete industry-relevant certifications to boost credibility"
          ],
          actions: analysis.gaps.slice(0, 3).map(gap => ({
            action: `Complete comprehensive ${gap.skill} training and certification`,
            timeRequired: gap.timeToAcquire,
            priority: gap.impact,
            resources: [
              "Premium online courses (Coursera, Udemy, Pluralsight)",
              "Official documentation and tutorials",
              "Hands-on practice projects",
              "Industry mentorship programs"
            ]
          }))
        },
        {
          phase: "Phase 2: Advanced Skill Development & Portfolio Building (Month 3-4)",
          goals: [
            `Achieve advanced proficiency in ${targetField} core technologies`,
            "Create impressive portfolio showcasing real-world problem solving",
            "Build professional network within target industry",
            "Start contributing to open-source projects for visibility"
          ],
          actions: [
            {
              action: `Complete advanced ${targetField} specialization and obtain industry certifications`,
              timeRequired: "6-8 weeks",
              priority: "High",
              resources: [
                "Advanced certification programs (AWS, Google Cloud, Microsoft)",
                "Hands-on labs and real-world projects",
                "Professional study groups and bootcamps",
                "Industry conferences and workshops"
              ]
            },
            {
              action: "Develop 3-4 comprehensive portfolio projects with real business impact",
              timeRequired: "6-8 weeks",
              priority: "High",
              resources: [
                "GitHub for version control and showcase",
                "Professional portfolio website",
                "Comprehensive project documentation",
                "Video demonstrations and case studies"
              ]
            },
            {
              action: "Establish thought leadership through content creation",
              timeRequired: "4 weeks",
              priority: "Medium",
              resources: [
                "LinkedIn articles and posts",
                "Technical blog writing",
                "Speaking at local meetups",
                "Podcast appearances or hosting"
              ]
            }
          ]
        },
        {
          phase: "Phase 3: Market Positioning & Job Search Optimization (Month 5-6)",
          goals: [
            "Position yourself as a top-tier candidate in the market",
            "Launch strategic job search targeting premium opportunities",
            "Master technical interviews and salary negotiations",
            "Secure multiple job offers at target salary range"
          ],
          actions: [
            {
              action: "Professional resume and LinkedIn optimization with ATS compatibility",
              timeRequired: "2 weeks",
              priority: "High",
              resources: [
                "Professional resume writing services",
                "ATS optimization tools and keywords",
                "LinkedIn profile optimization",
                "Professional headshots and branding"
              ]
            },
            {
              action: "Master technical interviews, system design, and behavioral questions",
              timeRequired: "6 weeks",
              priority: "High",
              resources: [
                "LeetCode Premium and HackerRank",
                "Mock interviews with industry professionals",
                "System design interview preparation",
                "Behavioral interview coaching and STAR method"
              ]
            },
            {
              action: "Strategic job applications and networking outreach",
              timeRequired: "4 weeks",
              priority: "High",
              resources: [
                "Premium job boards and company research",
                "Professional networking events",
                "Recruiter relationship building",
                "Salary negotiation coaching"
              ]
            }
          ]
        }
      ],
      milestones: [
        {
          milestone: `Master ${analysis.gaps[0]?.skill || 'primary skill gap'} and complete certification`,
          deadline: "Week 6",
          scoreImpact: "+20%"
        },
        {
          milestone: "Launch professional portfolio website with 3+ projects",
          deadline: "Week 10",
          scoreImpact: "+15%"
        },
        {
          milestone: "Complete advanced specialization and industry recognition",
          deadline: "Week 16",
          scoreImpact: "+25%"
        },
        {
          milestone: "Launch strategic job search with optimized materials",
          deadline: "Week 20",
          scoreImpact: "+10%"
        },
        {
          milestone: `Secure ${targetField} role at $${targetSalary}+ per hour`,
          deadline: "Week 24",
          scoreImpact: "+30%"
        }
      ],
      estimatedImprovement: Math.min(45, Math.max(15, 100 - analysis.matchScore)),
      successProbability: Math.min(95, analysis.matchScore + 35),
      timeToTarget: timeframe === '3-month' ? '12 weeks' : '24 weeks',
      keySuccessFactors: [
        `Consistent daily practice in ${targetField} technologies`,
        "Building a strong professional network and personal brand",
        "Focusing on high-impact projects that demonstrate business value",
        "Continuous learning and staying updated with industry trends"
      ]
    });

    const mockRoadmap = generateComprehensiveRoadmap();

    if (!this.isConfigured) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      return mockRoadmap;
    }

    const prompt = `Create a comprehensive ${timeframe} career roadmap for a ${targetField} professional targeting $${targetSalary}/hour roles.

    CURRENT PROFILE ANALYSIS:
    - Skills: ${JSON.stringify(analysis.extractedSkills)}
    - Experience: ${analysis.experienceYears} years
    - Current Match Score: ${analysis.matchScore}%
    - Gaps: ${JSON.stringify(analysis.gaps)}
    - Strengths: ${JSON.stringify(analysis.strengths)}
    - Target: ${targetField} at $${targetSalary}/hour

    Create a strategic roadmap to increase match probability to 85%+ with this JSON structure:
    {
      "timeline": "${timeframe}",
      "phases": [
        {
          "phase": "Phase 1: Skill Foundation & Gap Closure (Month 1-2)",
          "goals": ["specific, measurable goals"],
          "actions": [
            {
              "action": "specific actionable step",
              "timeRequired": "realistic timeframe",
              "priority": "High",
              "resources": ["specific resources and tools"]
            }
          ]
        }
      ],
      "milestones": [
        {
          "milestone": "specific achievement",
          "deadline": "specific timeframe",
          "scoreImpact": "realistic improvement"
        }
      ],
      "estimatedImprovement": "total expected improvement",
      "successProbability": "probability of achieving target",
      "keySuccessFactors": ["critical success factors"]
    }

    Focus on:
    1. Addressing specific skill gaps identified in the analysis
    2. Building a strong portfolio and professional presence
    3. Strategic job search and interview preparation
    4. Realistic timelines and measurable outcomes
    `;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        console.warn('OpenAI API failed for roadmap generation, using enhanced mock data');
        return mockRoadmap;
      }

      const data = await response.json();
      const aiRoadmap = JSON.parse(data.choices[0].message.content);
      return aiRoadmap;
    } catch (error) {
      console.warn('Roadmap generation failed, using mock data:', error);
      return mockRoadmap;
    }
  }

  async rankJobs(
    jobs: any[],
    userProfile: ResumeAnalysis,
    targetField: string,
    targetSalary: number
  ): Promise<JobMatch[]> {
    // Enhanced job ranking with field-specific matching
    const rankedJobs = jobs.map((job, index) => {
      // Calculate match score based on skill alignment
      const skillMatch = this.calculateSkillMatch(job.required_skills || [], userProfile.extractedSkills);
      const experienceMatch = this.calculateExperienceMatch(job.experience_level, userProfile.experienceYears);
      const salaryMatch = this.calculateSalaryMatch(job.salary_min, job.salary_max, targetSalary);
      
      const overallMatch = Math.round((skillMatch * 0.5 + experienceMatch * 0.3 + salaryMatch * 0.2));
      
      return {
        jobTitle: job.title || job.jobTitle || `${targetField} Position`,
        companyName: job.company || job.companyName || `Company ${index + 1}`,
        salaryMin: job.salary_min || job.salaryMin || Math.max(30, targetSalary - 20),
        salaryMax: job.salary_max || job.salaryMax || targetSalary + 20,
        location: job.location || 'Remote',
        jobType: job.job_type || job.jobType || 'Full-time',
        requiredSkills: job.required_skills || job.requiredSkills || userProfile.extractedSkills.technical.slice(0, 4),
        jobDescription: job.description || job.jobDescription || `Exciting ${targetField} opportunity with growth potential.`,
        applicationUrl: job.apply_url || job.applicationUrl || '#',
        matchScore: Math.max(60, Math.min(95, overallMatch)),
        matchReason: job.relevance_explanation || `Strong alignment with your ${targetField} background and ${userProfile.experienceYears} years of experience.`
      };
    });

    // Sort by match score and return top matches
    return rankedJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }

  private calculateSkillMatch(jobSkills: string[], userSkills: any): number {
    if (!jobSkills || jobSkills.length === 0) return 70;
    
    const allUserSkills = [
      ...(userSkills.technical || []),
      ...(userSkills.frameworks || []),
      ...(userSkills.tools || [])
    ].map(skill => skill.toLowerCase());
    
    const matchingSkills = jobSkills.filter(skill => 
      allUserSkills.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
      )
    );
    
    return Math.min(95, 50 + (matchingSkills.length / jobSkills.length) * 45);
  }

  private calculateExperienceMatch(jobLevel: string, userYears: number): number {
    const levelRequirements = {
      'entry': { min: 0, max: 2 },
      'mid': { min: 2, max: 5 },
      'senior': { min: 5, max: 10 },
      'lead': { min: 8, max: 15 }
    };
    
    const requirement = levelRequirements[jobLevel as keyof typeof levelRequirements] || levelRequirements.mid;
    
    if (userYears >= requirement.min && userYears <= requirement.max) return 90;
    if (userYears >= requirement.min - 1 && userYears <= requirement.max + 2) return 75;
    return 60;
  }

  private calculateSalaryMatch(jobMin: number, jobMax: number, targetSalary: number): number {
    if (!jobMin && !jobMax) return 70;
    
    const jobAvg = jobMax ? (jobMin + jobMax) / 2 : jobMin;
    const difference = Math.abs(jobAvg - targetSalary);
    const percentDiff = difference / targetSalary;
    
    if (percentDiff <= 0.1) return 95; // Within 10%
    if (percentDiff <= 0.2) return 85; // Within 20%
    if (percentDiff <= 0.3) return 75; // Within 30%
    return 60;
  }
}

export const aiService = new AIService();
export type { ResumeAnalysis, JobMatch };