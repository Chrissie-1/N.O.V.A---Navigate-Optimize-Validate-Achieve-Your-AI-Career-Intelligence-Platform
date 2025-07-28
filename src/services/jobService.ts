interface JobSearchParams {
  field: string;
  location?: string;
  salaryMin?: number;
  jobType?: string;
  experience?: string;
}

interface JobTemplate {
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  salary_adjustment: number;
  relevance_explanation: string;
  experience_level: 'entry' | 'mid' | 'senior' | 'lead';
}

class JobService {
  private rapidApiKey: string;
  private baseUrl = 'https://jobs-api14.p.rapidapi.com';

  constructor() {
    this.rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    if (!this.rapidApiKey) {
      console.warn('RapidAPI key not found, using enhanced mock data');
    }
  }

  async searchJobs(params: JobSearchParams): Promise<any[]> {
    if (!this.rapidApiKey) {
      console.log('No RapidAPI key found, returning field-specific mock jobs');
      return this.getFieldSpecificJobs(params);
    }

    try {
      const queryParams = new URLSearchParams({
        query: params.field,
        location: params.location || 'remote',
        ...(params.salaryMin && { salary_min: params.salaryMin.toString() }),
        ...(params.jobType && { job_type: params.jobType }),
        ...(params.experience && { experience_level: params.experience }),
      });

      const response = await fetch(`${this.baseUrl}/list?${queryParams}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'jobs-api14.p.rapidapi.com',
        },
      });

      if (!response.ok) {
        console.warn(`Job API error: ${response.status} ${response.statusText}`);
        return this.getFieldSpecificJobs(params);
      }

      const data = await response.json();
      return data.jobs || data || [];
    } catch (error) {
      console.warn('Error fetching jobs, using field-specific mock data:', error);
      return this.getFieldSpecificJobs(params);
    }
  }

  private analyzeField(field: string): {
    category: string;
    subfields: string[];
    keywords: string[];
  } {
    const fieldLower = field.toLowerCase();
    
    // Data & Analytics
    if (fieldLower.includes('data') || fieldLower.includes('analyst') || fieldLower.includes('scientist')) {
      return {
        category: 'data_analytics',
        subfields: ['data science', 'data analysis', 'machine learning', 'business intelligence'],
        keywords: ['python', 'sql', 'tableau', 'machine learning', 'statistics', 'pandas', 'numpy']
      };
    }
    
    // Software Development
    if (fieldLower.includes('developer') || fieldLower.includes('engineer') || fieldLower.includes('software') || fieldLower.includes('programming')) {
      return {
        category: 'software_development',
        subfields: ['frontend', 'backend', 'full-stack', 'mobile', 'devops'],
        keywords: ['javascript', 'react', 'node.js', 'python', 'java', 'aws', 'docker']
      };
    }
    
    // Product Management
    if (fieldLower.includes('product') || fieldLower.includes('manager')) {
      return {
        category: 'product_management',
        subfields: ['product strategy', 'product marketing', 'growth', 'technical product'],
        keywords: ['roadmapping', 'agile', 'scrum', 'analytics', 'user research', 'stakeholder management']
      };
    }
    
    // Marketing & Digital
    if (fieldLower.includes('marketing') || fieldLower.includes('digital') || fieldLower.includes('seo') || fieldLower.includes('content')) {
      return {
        category: 'marketing',
        subfields: ['digital marketing', 'content marketing', 'seo', 'social media', 'email marketing'],
        keywords: ['google analytics', 'seo', 'content creation', 'social media', 'email campaigns', 'ppc']
      };
    }
    
    // Design & UX
    if (fieldLower.includes('design') || fieldLower.includes('ux') || fieldLower.includes('ui')) {
      return {
        category: 'design',
        subfields: ['ux design', 'ui design', 'graphic design', 'product design'],
        keywords: ['figma', 'sketch', 'adobe', 'prototyping', 'user research', 'wireframing']
      };
    }
    
    // Finance & Accounting
    if (fieldLower.includes('finance') || fieldLower.includes('accounting') || fieldLower.includes('financial')) {
      return {
        category: 'finance',
        subfields: ['financial analysis', 'accounting', 'investment', 'corporate finance'],
        keywords: ['excel', 'financial modeling', 'accounting', 'budgeting', 'forecasting', 'compliance']
      };
    }
    
    // Sales & Business Development
    if (fieldLower.includes('sales') || fieldLower.includes('business development') || fieldLower.includes('account')) {
      return {
        category: 'sales',
        subfields: ['inside sales', 'account management', 'business development', 'sales operations'],
        keywords: ['crm', 'salesforce', 'lead generation', 'negotiation', 'pipeline management']
      };
    }
    
    // Default/Generic
    return {
      category: 'general',
      subfields: ['professional services', 'consulting', 'operations'],
      keywords: ['communication', 'project management', 'analysis', 'strategy']
    };
  }

  private getFieldSpecificJobs(params: JobSearchParams): any[] {
    const fieldAnalysis = this.analyzeField(params.field);
    const jobTemplates = this.getJobTemplatesForCategory(fieldAnalysis.category, params.field);
    
    return jobTemplates.map((template, index) => ({
      id: `job_${index + 1}`,
      title: template.title,
      company: template.company,
      location: index === 0 ? 'Remote' : index === 1 ? 'San Francisco, CA' : 'New York, NY',
      salary_min: Math.max(params.salaryMin || 50, 60) + template.salary_adjustment,
      salary_max: Math.max(params.salaryMin || 50, 60) + template.salary_adjustment + 25,
      job_type: 'Full-time',
      description: template.description,
      required_skills: template.required_skills,
      posted_date: index === 0 ? '2 days ago' : index === 1 ? '1 week ago' : '4 days ago',
      apply_url: `https://example.com/apply/${index + 1}`,
      relevance_explanation: template.relevance_explanation,
      experience_level: template.experience_level
    }));
  }

  private getJobTemplatesForCategory(category: string, originalField: string): JobTemplate[] {
    switch (category) {
      case 'data_analytics':
        return [
          {
            title: 'Senior Data Analyst',
            company: 'DataTech Solutions',
            description: 'Lead data analysis initiatives, build predictive models, and drive data-driven decision making. Work with large datasets to uncover business insights and present findings to stakeholders.',
            required_skills: ['Python', 'SQL', 'Tableau', 'Pandas', 'NumPy', 'Statistics', 'Machine Learning'],
            salary_adjustment: 15,
            relevance_explanation: 'Direct match for data analysis skills with advanced statistical modeling and business intelligence focus.',
            experience_level: 'senior'
          },
          {
            title: 'Machine Learning Engineer',
            company: 'AI Innovations Corp',
            description: 'Design and implement ML algorithms, deploy models to production, and optimize performance. Collaborate with data scientists to bring research into scalable solutions.',
            required_skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Docker', 'Kubernetes', 'AWS'],
            salary_adjustment: 25,
            relevance_explanation: 'Perfect fit for data science background with focus on productionizing ML models and algorithms.',
            experience_level: 'senior'
          },
          {
            title: 'Business Intelligence Analyst',
            company: 'Enterprise Analytics',
            description: 'Create dashboards, analyze business metrics, and provide actionable insights to leadership. Transform raw data into strategic business recommendations.',
            required_skills: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Data Visualization', 'Business Analysis'],
            salary_adjustment: 10,
            relevance_explanation: 'Excellent match for analytical skills with business focus and data visualization expertise.',
            experience_level: 'mid'
          }
        ];

      case 'software_development':
        return [
          {
            title: 'Senior Full Stack Developer',
            company: 'TechFlow Systems',
            description: 'Build scalable web applications using modern technologies. Lead technical decisions, mentor junior developers, and contribute to system architecture.',
            required_skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
            salary_adjustment: 20,
            relevance_explanation: 'Perfect match for software development skills with full-stack expertise and leadership opportunities.',
            experience_level: 'senior'
          },
          {
            title: 'Frontend Engineer',
            company: 'UI/UX Innovations',
            description: 'Create responsive, user-friendly interfaces using React and modern frontend technologies. Collaborate with designers to implement pixel-perfect designs.',
            required_skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Webpack', 'Jest'],
            salary_adjustment: 15,
            relevance_explanation: 'Ideal for frontend development focus with modern JavaScript frameworks and UI/UX collaboration.',
            experience_level: 'mid'
          },
          {
            title: 'DevOps Engineer',
            company: 'Cloud Infrastructure Co',
            description: 'Manage CI/CD pipelines, automate deployments, and maintain cloud infrastructure. Ensure system reliability and optimize performance.',
            required_skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'Python'],
            salary_adjustment: 22,
            relevance_explanation: 'Great fit for software engineering background with infrastructure and automation focus.',
            experience_level: 'senior'
          }
        ];

      case 'product_management':
        return [
          {
            title: 'Senior Product Manager',
            company: 'Product Excellence Inc',
            description: 'Drive product strategy and roadmap for flagship products. Work cross-functionally with engineering, design, and marketing to deliver user-centric solutions.',
            required_skills: ['Product Strategy', 'Roadmapping', 'Agile', 'User Research', 'Analytics', 'Stakeholder Management'],
            salary_adjustment: 18,
            relevance_explanation: 'Direct match for product management skills with strategic planning and cross-functional leadership.',
            experience_level: 'senior'
          },
          {
            title: 'Growth Product Manager',
            company: 'Scale Ventures',
            description: 'Focus on user acquisition, retention, and growth metrics. Design and execute experiments to optimize conversion funnels and user engagement.',
            required_skills: ['Growth Hacking', 'A/B Testing', 'Analytics', 'SQL', 'Product Marketing', 'Conversion Optimization'],
            salary_adjustment: 16,
            relevance_explanation: 'Perfect for product management with data-driven growth focus and experimentation expertise.',
            experience_level: 'mid'
          },
          {
            title: 'Technical Product Manager',
            company: 'Enterprise Solutions',
            description: 'Bridge technical and business requirements for complex B2B products. Work closely with engineering teams on API design and technical specifications.',
            required_skills: ['Technical Writing', 'API Design', 'Software Architecture', 'Agile', 'Stakeholder Management', 'B2B Products'],
            salary_adjustment: 20,
            relevance_explanation: 'Excellent match for product management with technical depth and enterprise software focus.',
            experience_level: 'senior'
          }
        ];

      case 'marketing':
        return [
          {
            title: 'Digital Marketing Manager',
            company: 'Growth Marketing Co',
            description: 'Lead digital marketing campaigns across multiple channels. Optimize SEO, manage PPC campaigns, and analyze performance metrics to drive growth.',
            required_skills: ['Google Analytics', 'SEO', 'PPC', 'Content Marketing', 'Social Media', 'Email Marketing'],
            salary_adjustment: 12,
            relevance_explanation: 'Perfect match for digital marketing expertise with multi-channel campaign management and analytics.',
            experience_level: 'mid'
          },
          {
            title: 'Content Marketing Specialist',
            company: 'Brand Storytellers',
            description: 'Create compelling content strategies, write engaging copy, and manage content calendars. Drive brand awareness through storytelling and thought leadership.',
            required_skills: ['Content Creation', 'Copywriting', 'SEO', 'Social Media', 'Brand Strategy', 'Analytics'],
            salary_adjustment: 8,
            relevance_explanation: 'Ideal for marketing background with content creation and brand storytelling focus.',
            experience_level: 'mid'
          },
          {
            title: 'Marketing Analytics Manager',
            company: 'Data-Driven Marketing',
            description: 'Analyze marketing performance, build attribution models, and provide insights to optimize campaigns. Bridge marketing and data science teams.',
            required_skills: ['Google Analytics', 'SQL', 'Tableau', 'Attribution Modeling', 'A/B Testing', 'Marketing Automation'],
            salary_adjustment: 15,
            relevance_explanation: 'Excellent match combining marketing knowledge with analytical skills and data-driven decision making.',
            experience_level: 'senior'
          }
        ];

      case 'design':
        return [
          {
            title: 'Senior UX Designer',
            company: 'Design Excellence Studio',
            description: 'Lead user experience design for digital products. Conduct user research, create wireframes and prototypes, and collaborate with product teams.',
            required_skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems'],
            salary_adjustment: 14,
            relevance_explanation: 'Perfect match for UX design skills with user research and product design focus.',
            experience_level: 'senior'
          },
          {
            title: 'Product Designer',
            company: 'Innovation Labs',
            description: 'Design end-to-end user experiences for SaaS products. Work closely with engineering and product management to deliver intuitive interfaces.',
            required_skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Testing', 'Design Systems', 'HTML/CSS'],
            salary_adjustment: 12,
            relevance_explanation: 'Ideal for design background with product focus and cross-functional collaboration.',
            experience_level: 'mid'
          },
          {
            title: 'UI/UX Designer',
            company: 'Digital Experiences Co',
            description: 'Create beautiful and functional user interfaces. Balance aesthetic design with usability principles to deliver exceptional user experiences.',
            required_skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'Visual Design'],
            salary_adjustment: 10,
            relevance_explanation: 'Great match for design skills with both UI and UX expertise and visual design focus.',
            experience_level: 'mid'
          }
        ];

      case 'finance':
        return [
          {
            title: 'Senior Financial Analyst',
            company: 'Financial Services Corp',
            description: 'Perform financial modeling, budgeting, and forecasting. Analyze business performance and provide strategic recommendations to leadership.',
            required_skills: ['Excel', 'Financial Modeling', 'Budgeting', 'Forecasting', 'SQL', 'Tableau'],
            salary_adjustment: 16,
            relevance_explanation: 'Direct match for financial analysis skills with modeling and strategic planning expertise.',
            experience_level: 'senior'
          },
          {
            title: 'Corporate Finance Manager',
            company: 'Enterprise Finance Solutions',
            description: 'Manage corporate financial planning, M&A analysis, and capital allocation decisions. Support strategic initiatives with financial insights.',
            required_skills: ['Financial Planning', 'M&A Analysis', 'Valuation', 'Capital Markets', 'Excel', 'PowerPoint'],
            salary_adjustment: 20,
            relevance_explanation: 'Perfect for finance background with corporate strategy and investment analysis focus.',
            experience_level: 'senior'
          },
          {
            title: 'Business Finance Analyst',
            company: 'Growth Finance Partners',
            description: 'Support business units with financial analysis, variance reporting, and performance metrics. Partner with operations teams on financial planning.',
            required_skills: ['Financial Analysis', 'Excel', 'Budgeting', 'Variance Analysis', 'Business Partnering', 'Reporting'],
            salary_adjustment: 12,
            relevance_explanation: 'Excellent match for finance skills with business partnership and operational analysis focus.',
            experience_level: 'mid'
          }
        ];

      case 'sales':
        return [
          {
            title: 'Senior Account Executive',
            company: 'Enterprise Sales Solutions',
            description: 'Manage enterprise client relationships, drive revenue growth, and close complex deals. Build long-term partnerships with key accounts.',
            required_skills: ['Salesforce', 'Account Management', 'Negotiation', 'Enterprise Sales', 'Relationship Building', 'CRM'],
            salary_adjustment: 18,
            relevance_explanation: 'Perfect match for sales expertise with enterprise focus and account management skills.',
            experience_level: 'senior'
          },
          {
            title: 'Business Development Manager',
            company: 'Growth Partners Inc',
            description: 'Identify new business opportunities, build strategic partnerships, and expand market presence. Drive revenue through relationship building.',
            required_skills: ['Business Development', 'Partnership Management', 'Lead Generation', 'Market Research', 'Negotiation', 'CRM'],
            salary_adjustment: 15,
            relevance_explanation: 'Ideal for sales background with business development and partnership focus.',
            experience_level: 'mid'
          },
          {
            title: 'Sales Operations Analyst',
            company: 'Revenue Analytics Co',
            description: 'Analyze sales performance, optimize processes, and provide insights to sales teams. Manage CRM systems and sales reporting.',
            required_skills: ['Salesforce', 'Excel', 'SQL', 'Sales Analytics', 'Process Optimization', 'Reporting'],
            salary_adjustment: 13,
            relevance_explanation: 'Great match combining sales knowledge with analytical skills and operations focus.',
            experience_level: 'mid'
          }
        ];

      default:
        return [
          {
            title: `Senior ${originalField} Specialist`,
            company: 'Professional Services Inc',
            description: `Lead ${originalField.toLowerCase()} initiatives and drive strategic outcomes. Work with cross-functional teams to deliver high-impact results.`,
            required_skills: ['Leadership', 'Strategy', 'Analysis', 'Project Management', 'Communication', 'Problem Solving'],
            salary_adjustment: 12,
            relevance_explanation: `Direct match for ${originalField} expertise with leadership and strategic focus.`,
            experience_level: 'senior'
          },
          {
            title: `${originalField} Manager`,
            company: 'Industry Leaders LLC',
            description: `Manage ${originalField.toLowerCase()} operations and team performance. Develop strategies to optimize processes and achieve business objectives.`,
            required_skills: ['Management', 'Strategy', 'Operations', 'Team Leadership', 'Process Improvement', 'Analytics'],
            salary_adjustment: 15,
            relevance_explanation: `Perfect for ${originalField} background with management and operational excellence focus.`,
            experience_level: 'senior'
          },
          {
            title: `${originalField} Consultant`,
            company: 'Consulting Excellence',
            description: `Provide expert ${originalField.toLowerCase()} consulting services to clients. Analyze complex problems and deliver strategic recommendations.`,
            required_skills: ['Consulting', 'Analysis', 'Strategy', 'Client Management', 'Presentation', 'Problem Solving'],
            salary_adjustment: 10,
            relevance_explanation: `Excellent match for ${originalField} expertise with consulting and advisory focus.`,
            experience_level: 'mid'
          }
        ];
    }
  }

  async getSalaryData(field: string, location: string = 'remote'): Promise<any> {
    try {
      const fieldAnalysis = this.analyzeField(field);
      
      // Return field-specific salary data
      const salaryRanges = this.getSalaryRangesForCategory(fieldAnalysis.category);
      
      return {
        field,
        location,
        salary_ranges: salaryRanges,
        market_average: salaryRanges.mid.max,
        demand_level: this.getDemandLevel(fieldAnalysis.category)
      };
    } catch (error) {
      console.error('Error fetching salary data:', error);
      throw error;
    }
  }

  private getSalaryRangesForCategory(category: string) {
    const ranges = {
      data_analytics: {
        entry: { min: 50, max: 70 },
        mid: { min: 70, max: 95 },
        senior: { min: 95, max: 130 },
        lead: { min: 130, max: 160 }
      },
      software_development: {
        entry: { min: 55, max: 75 },
        mid: { min: 75, max: 105 },
        senior: { min: 105, max: 140 },
        lead: { min: 140, max: 180 }
      },
      product_management: {
        entry: { min: 60, max: 80 },
        mid: { min: 80, max: 110 },
        senior: { min: 110, max: 145 },
        lead: { min: 145, max: 175 }
      },
      marketing: {
        entry: { min: 40, max: 60 },
        mid: { min: 60, max: 85 },
        senior: { min: 85, max: 115 },
        lead: { min: 115, max: 140 }
      },
      design: {
        entry: { min: 45, max: 65 },
        mid: { min: 65, max: 90 },
        senior: { min: 90, max: 120 },
        lead: { min: 120, max: 150 }
      },
      finance: {
        entry: { min: 50, max: 70 },
        mid: { min: 70, max: 95 },
        senior: { min: 95, max: 125 },
        lead: { min: 125, max: 155 }
      },
      sales: {
        entry: { min: 45, max: 65 },
        mid: { min: 65, max: 90 },
        senior: { min: 90, max: 120 },
        lead: { min: 120, max: 150 }
      },
      general: {
        entry: { min: 40, max: 60 },
        mid: { min: 60, max: 85 },
        senior: { min: 85, max: 115 },
        lead: { min: 115, max: 145 }
      }
    };

    return ranges[category as keyof typeof ranges] || ranges.general;
  }

  private getDemandLevel(category: string): string {
    const demandLevels = {
      data_analytics: 'Very High',
      software_development: 'Very High',
      product_management: 'High',
      marketing: 'High',
      design: 'High',
      finance: 'Medium',
      sales: 'High',
      general: 'Medium'
    };

    return demandLevels[category as keyof typeof demandLevels] || 'Medium';
  }
}

export const jobService = new JobService();