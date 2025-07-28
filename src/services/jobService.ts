interface JobSearchParams {
  field: string;
  location?: string;
  salaryMin?: number;
  jobType?: string;
  experience?: string;
}

class JobService {
  private rapidApiKey: string;
  private baseUrl = 'https://jobs-api14.p.rapidapi.com';

  constructor() {
    this.rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    // Don't throw error, just log warning and use mock data
    if (!this.rapidApiKey) {
      console.warn('RapidAPI key not found, using mock data');
    }
  }

  async searchJobs(params: JobSearchParams): Promise<any[]> {
    // If no API key, return mock data immediately
    if (!this.rapidApiKey) {
      console.log('No RapidAPI key found, returning mock jobs');
      return this.getMockJobs(params);
    }

    try {
      // Construct query parameters
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
        return this.getMockJobs(params);
      }

      const data = await response.json();
      return data.jobs || data || [];
    } catch (error) {
      console.warn('Error fetching jobs, using mock data:', error);
      
      // Return mock data for development
      return this.getMockJobs(params);
    }
  }

  private getMockJobs(params: JobSearchParams): any[] {
    // Enhanced mock job data based on target field
    const fieldKeywords = params.field.toLowerCase();
    const isDataRole = fieldKeywords.includes('data') || fieldKeywords.includes('analyst') || fieldKeywords.includes('scientist');
    const isDevRole = fieldKeywords.includes('developer') || fieldKeywords.includes('engineer') || fieldKeywords.includes('software');
    const isProductRole = fieldKeywords.includes('product') || fieldKeywords.includes('manager');
    const isDesignRole = fieldKeywords.includes('design') || fieldKeywords.includes('ux') || fieldKeywords.includes('ui');

    let jobTemplates = [];

    if (isDataRole) {
      jobTemplates = [
        {
          title: `Senior Data Analyst`,
          company: 'DataTech Solutions',
          description: `We're seeking an experienced Data Analyst to join our analytics team. You'll work with large datasets, build predictive models, and drive data-driven decision making across the organization.`,
          required_skills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Tableau', 'AWS'],
          salary_adjustment: 10
        },
        {
          title: `Lead Data Analyst`,
          company: 'AI Innovations Inc',
          description: `Lead our data science initiatives and mentor junior team members. Work on cutting-edge ML projects with real business impact.`,
          required_skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Docker', 'Kubernetes', 'GCP'],
          salary_adjustment: 20
        },
        {
          title: `Data Analyst - Remote`,
          company: 'Global Analytics Corp',
          description: `Remote opportunity to work with international datasets and build scalable analytics solutions.`,
          required_skills: ['R', 'Python', 'SQL', 'Spark', 'Hadoop', 'Visualization', 'Statistics'],
          salary_adjustment: 5
        }
      ];
    } else if (isDevRole) {
      jobTemplates = [
        {
          title: `Senior Software Engineer`,
          company: 'TechFlow Systems',
          description: `Join our engineering team building scalable web applications. Work with modern technologies and contribute to architecture decisions.`,
          required_skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL'],
          salary_adjustment: 15
        },
        {
          title: `Full Stack Developer`,
          company: 'Innovation Labs',
          description: `Full-stack development role working on next-generation SaaS products. Great opportunity for growth and learning.`,
          required_skills: ['React', 'Python', 'Django', 'PostgreSQL', 'Redis', 'Celery', 'AWS'],
          salary_adjustment: 10
        },
        {
          title: `Lead Software Engineer`,
          company: 'Startup Unicorn',
          description: `Lead engineering initiatives at a fast-growing startup. Equity package and opportunity to shape technical direction.`,
          required_skills: ['Microservices', 'Kubernetes', 'Go', 'React', 'PostgreSQL', 'Redis', 'GCP'],
          salary_adjustment: 25
        }
      ];
    } else if (isProductRole) {
      jobTemplates = [
        {
          title: `Senior Product Manager`,
          company: 'Product Excellence Co',
          description: `Drive product strategy and roadmap for our flagship products. Work closely with engineering and design teams.`,
          required_skills: ['Product Strategy', 'Agile', 'Scrum', 'Analytics', 'User Research', 'Roadmapping'],
          salary_adjustment: 12
        },
        {
          title: `Product Manager - Growth`,
          company: 'Scale Ventures',
          description: `Focus on growth initiatives and user acquisition strategies. Data-driven approach to product development.`,
          required_skills: ['Growth Hacking', 'A/B Testing', 'Analytics', 'SQL', 'Product Marketing', 'UX'],
          salary_adjustment: 8
        },
        {
          title: `Lead Product Manager`,
          company: 'Enterprise Solutions',
          description: `Lead product management for enterprise B2B solutions. Strategic role with high impact and visibility.`,
          required_skills: ['B2B Products', 'Enterprise Sales', 'Roadmapping', 'Stakeholder Management', 'Strategy'],
          salary_adjustment: 18
        }
      ];
    } else {
      // Generic roles
      jobTemplates = [
        {
          title: `Senior Professional`,
          company: 'Professional Services Inc',
          description: `Exciting opportunity to work with a growing team and excellent benefits.`,
          required_skills: ['Communication', 'Problem Solving', 'Leadership', 'Project Management'],
          salary_adjustment: 10
        },
        {
          title: `Industry Specialist`,
          company: 'Industry Leaders LLC',
          description: `Specialized role with opportunities for professional development.`,
          required_skills: ['Expertise', 'Analysis', 'Strategy', 'Implementation'],
          salary_adjustment: 5
        },
        {
          title: `Team Lead`,
          company: 'Growth Company',
          description: `Leadership role with opportunity to build and mentor a team.`,
          required_skills: ['Leadership', 'Strategy', 'Team Building', 'Process Improvement'],
          salary_adjustment: 15
        }
      ];
    }

    return jobTemplates.map((template, index) => ({
      id: '1',
        title: template.title,
        company: template.company,
        location: index === 0 ? 'Remote' : index === 1 ? 'San Francisco, CA' : 'New York, NY',
        salary_min: Math.max(params.salaryMin || 50, 60) + template.salary_adjustment,
        salary_max: Math.max(params.salaryMin || 50, 60) + template.salary_adjustment + 25,
        job_type: 'Full-time',
        description: template.description,
        required_skills: template.required_skills,
        posted_date: index === 0 ? '2 days ago' : index === 1 ? '1 week ago' : '4 days ago',
        apply_url: `https://example.com/apply/${index + 1}`
      }));
  }

  async getSalaryData(field: string, location: string = 'remote'): Promise<any> {
    try {
      // This would integrate with a salary API
      // For now, return mock data
      return {
        field,
        location,
        salary_ranges: {
          entry: { min: 40, max: 60 },
          mid: { min: 60, max: 85 },
          senior: { min: 85, max: 120 },
          lead: { min: 120, max: 150 }
        },
        market_average: 75,
        demand_level: 'High'
      };
    } catch (error) {
      console.error('Error fetching salary data:', error);
      throw error;
    }
  }
}

export const jobService = new JobService();