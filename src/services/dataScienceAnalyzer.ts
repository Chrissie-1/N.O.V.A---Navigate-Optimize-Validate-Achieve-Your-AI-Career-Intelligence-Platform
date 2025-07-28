interface DataScienceAnalysis {
  overallRelevanceScore: number; // 1-10 scale
  keyStrengths: string[];
  majorGaps: string[];
  irrelevantElements: string[];
  improvementRecommendations: string[];
  jobReadinessAssessment: string;
  technicalSkillsBreakdown: {
    programming: { present: string[]; missing: string[]; score: number };
    statistics: { present: string[]; missing: string[]; score: number };
    machineLearning: { present: string[]; missing: string[]; score: number };
    dataTools: { present: string[]; missing: string[]; score: number };
    visualization: { present: string[]; missing: string[]; score: number };
  };
  experienceRelevance: {
    dataRelatedExperience: string[];
    analyticalExperience: string[];
    irrelevantExperience: string[];
    experienceScore: number;
  };
  educationAssessment: {
    relevantEducation: string[];
    supportiveEducation: string[];
    irrelevantEducation: string[];
    educationScore: number;
  };
}

class DataScienceResumeAnalyzer {
  private requiredTechnicalSkills = {
    programming: {
      essential: ['python', 'sql', 'r'],
      important: ['pandas', 'numpy', 'scikit-learn', 'jupyter', 'git'],
      bonus: ['scala', 'java', 'spark', 'hadoop', 'tensorflow', 'pytorch']
    },
    statistics: {
      essential: ['statistics', 'probability', 'hypothesis testing'],
      important: ['regression', 'statistical modeling', 'a/b testing', 'experimental design'],
      bonus: ['bayesian', 'time series', 'multivariate analysis']
    },
    machineLearning: {
      essential: ['machine learning', 'supervised learning', 'unsupervised learning'],
      important: ['classification', 'regression', 'clustering', 'feature engineering', 'model validation'],
      bonus: ['deep learning', 'neural networks', 'nlp', 'computer vision', 'reinforcement learning']
    },
    dataTools: {
      essential: ['excel', 'databases'],
      important: ['tableau', 'power bi', 'aws', 'azure', 'gcp'],
      bonus: ['docker', 'kubernetes', 'airflow', 'kafka', 'elasticsearch']
    },
    visualization: {
      essential: ['data visualization'],
      important: ['matplotlib', 'seaborn', 'plotly', 'ggplot2'],
      bonus: ['d3.js', 'bokeh', 'dash', 'shiny']
    }
  };

  private relevantEducationFields = [
    'data science', 'statistics', 'mathematics', 'computer science', 
    'physics', 'engineering', 'economics', 'quantitative', 'analytics',
    'machine learning', 'artificial intelligence', 'operations research'
  ];

  private irrelevantFields = [
    'interior design', 'fashion', 'culinary', 'hospitality', 'retail',
    'construction', 'civil engineering', 'mechanical engineering', 
    'architecture', 'graphic design', 'fine arts', 'music', 'theater',
    'real estate', 'insurance sales', 'restaurant management'
  ];

  private dataRelatedRoles = [
    'data scientist', 'data analyst', 'business analyst', 'research analyst',
    'quantitative analyst', 'statistician', 'machine learning engineer',
    'data engineer', 'business intelligence', 'market research'
  ];

  analyzeResume(resumeText: string): DataScienceAnalysis {
    const words = resumeText.toLowerCase().split(/\s+/);
    const content = resumeText.toLowerCase();

    // Check for completely irrelevant fields first
    const irrelevantFieldMatches = this.irrelevantFields.filter(field => 
      content.includes(field) || words.some(word => word.includes(field))
    );

    if (irrelevantFieldMatches.length > 2) {
      return this.generateIrrelevantFieldAnalysis(irrelevantFieldMatches, resumeText);
    }

    // Perform detailed analysis
    const technicalSkills = this.analyzeTechnicalSkills(words, content);
    const experience = this.analyzeExperience(words, content);
    const education = this.analyzeEducation(words, content);

    const overallScore = this.calculateOverallScore(technicalSkills, experience, education);
    
    return {
      overallRelevanceScore: overallScore,
      keyStrengths: this.identifyKeyStrengths(technicalSkills, experience, education),
      majorGaps: this.identifyMajorGaps(technicalSkills, experience, education),
      irrelevantElements: this.identifyIrrelevantElements(words, content),
      improvementRecommendations: this.generateRecommendations(technicalSkills, experience, education, overallScore),
      jobReadinessAssessment: this.assessJobReadiness(overallScore, technicalSkills, experience),
      technicalSkillsBreakdown: technicalSkills,
      experienceRelevance: experience,
      educationAssessment: education
    };
  }

  private generateIrrelevantFieldAnalysis(irrelevantFields: string[], resumeText: string): DataScienceAnalysis {
    return {
      overallRelevanceScore: 1,
      keyStrengths: [],
      majorGaps: [
        'No data science technical skills identified',
        'No relevant analytical experience',
        'No quantitative educational background',
        'No programming or statistical knowledge demonstrated',
        'Complete field mismatch for data science requirements'
      ],
      irrelevantElements: irrelevantFields.map(field => 
        `Background in ${field} - not relevant to data science`
      ),
      improvementRecommendations: [
        'Complete a comprehensive data science bootcamp or degree program',
        'Learn Python programming and SQL database management',
        'Study statistics, probability, and machine learning fundamentals',
        'Build a portfolio of data science projects to demonstrate skills',
        'Consider starting with entry-level analyst roles to gain relevant experience',
        'Obtain relevant certifications (Google Data Analytics, IBM Data Science, etc.)'
      ],
      jobReadinessAssessment: 'NOT READY: This resume shows no relevance to data science. Candidate needs extensive retraining and skill development before being considered for any data science position. Recommend 12-18 months of intensive study and practice.',
      technicalSkillsBreakdown: {
        programming: { present: [], missing: ['Python', 'SQL', 'R'], score: 0 },
        statistics: { present: [], missing: ['Statistics', 'Probability', 'Hypothesis Testing'], score: 0 },
        machineLearning: { present: [], missing: ['Machine Learning', 'Supervised Learning'], score: 0 },
        dataTools: { present: [], missing: ['Excel', 'Tableau', 'Databases'], score: 0 },
        visualization: { present: [], missing: ['Data Visualization', 'Matplotlib'], score: 0 }
      },
      experienceRelevance: {
        dataRelatedExperience: [],
        analyticalExperience: [],
        irrelevantExperience: irrelevantFields,
        experienceScore: 0
      },
      educationAssessment: {
        relevantEducation: [],
        supportiveEducation: [],
        irrelevantEducation: irrelevantFields,
        educationScore: 0
      }
    };
  }

  private analyzeTechnicalSkills(words: string[], content: string) {
    const skillsBreakdown = {
      programming: { present: [] as string[], missing: [] as string[], score: 0 },
      statistics: { present: [] as string[], missing: [] as string[], score: 0 },
      machineLearning: { present: [] as string[], missing: [] as string[], score: 0 },
      dataTools: { present: [] as string[], missing: [] as string[], score: 0 },
      visualization: { present: [] as string[], missing: [] as string[], score: 0 }
    };

    // Check each skill category
    Object.entries(this.requiredTechnicalSkills).forEach(([category, skills]) => {
      const categoryKey = category as keyof typeof skillsBreakdown;
      let categoryScore = 0;
      let totalPossible = 0;

      ['essential', 'important', 'bonus'].forEach(level => {
        const skillList = skills[level as keyof typeof skills] as string[];
        const weight = level === 'essential' ? 3 : level === 'important' ? 2 : 1;
        
        skillList.forEach(skill => {
          totalPossible += weight;
          const hasSkill = words.some(word => word.includes(skill.toLowerCase())) || 
                          content.includes(skill.toLowerCase());
          
          if (hasSkill) {
            skillsBreakdown[categoryKey].present.push(skill);
            categoryScore += weight;
          } else if (level === 'essential' || level === 'important') {
            skillsBreakdown[categoryKey].missing.push(skill);
          }
        });
      });

      skillsBreakdown[categoryKey].score = Math.round((categoryScore / totalPossible) * 10);
    });

    return skillsBreakdown;
  }

  private analyzeExperience(words: string[], content: string) {
    const dataRelatedExp: string[] = [];
    const analyticalExp: string[] = [];
    const irrelevantExp: string[] = [];

    // Check for data-related roles
    this.dataRelatedRoles.forEach(role => {
      if (content.includes(role)) {
        dataRelatedExp.push(role);
      }
    });

    // Check for analytical keywords
    const analyticalKeywords = [
      'analysis', 'analytics', 'research', 'modeling', 'forecasting',
      'reporting', 'insights', 'metrics', 'kpi', 'dashboard'
    ];

    analyticalKeywords.forEach(keyword => {
      if (words.some(word => word.includes(keyword))) {
        analyticalExp.push(keyword);
      }
    });

    // Check for irrelevant experience
    this.irrelevantFields.forEach(field => {
      if (content.includes(field)) {
        irrelevantExp.push(field);
      }
    });

    const experienceScore = Math.min(10, 
      (dataRelatedExp.length * 3) + 
      (analyticalExp.length * 1) - 
      (irrelevantExp.length * 2)
    );

    return {
      dataRelatedExperience: dataRelatedExp,
      analyticalExperience: analyticalExp,
      irrelevantExperience: irrelevantExp,
      experienceScore: Math.max(0, experienceScore)
    };
  }

  private analyzeEducation(words: string[], content: string) {
    const relevantEd: string[] = [];
    const supportiveEd: string[] = [];
    const irrelevantEd: string[] = [];

    // Check for relevant education
    this.relevantEducationFields.forEach(field => {
      if (content.includes(field)) {
        relevantEd.push(field);
      }
    });

    // Check for degrees
    const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'degree'];
    degreeKeywords.forEach(degree => {
      if (words.some(word => word.includes(degree))) {
        supportiveEd.push(degree);
      }
    });

    // Check for irrelevant education
    this.irrelevantFields.forEach(field => {
      if (content.includes(field)) {
        irrelevantEd.push(field);
      }
    });

    const educationScore = Math.min(10, 
      (relevantEd.length * 4) + 
      (supportiveEd.length * 1) - 
      (irrelevantEd.length * 3)
    );

    return {
      relevantEducation: relevantEd,
      supportiveEducation: supportiveEd,
      irrelevantEducation: irrelevantEd,
      educationScore: Math.max(0, educationScore)
    };
  }

  private calculateOverallScore(technical: any, experience: any, education: any): number {
    const techAvg = Object.values(technical).reduce((sum: number, skill: any) => sum + skill.score, 0) / 5;
    const expScore = experience.experienceScore;
    const eduScore = education.educationScore;

    // Weighted average: Technical 50%, Experience 30%, Education 20%
    const weightedScore = (techAvg * 0.5) + (expScore * 0.3) + (eduScore * 0.2);
    
    return Math.round(Math.max(1, Math.min(10, weightedScore)));
  }

  private identifyKeyStrengths(technical: any, experience: any, education: any): string[] {
    const strengths: string[] = [];

    // Technical strengths
    Object.entries(technical).forEach(([category, data]: [string, any]) => {
      if (data.score >= 7 && data.present.length > 0) {
        strengths.push(`Strong ${category} skills: ${data.present.slice(0, 3).join(', ')}`);
      }
    });

    // Experience strengths
    if (experience.dataRelatedExperience.length > 0) {
      strengths.push(`Relevant data experience: ${experience.dataRelatedExperience.join(', ')}`);
    }

    // Education strengths
    if (education.relevantEducation.length > 0) {
      strengths.push(`Relevant educational background: ${education.relevantEducation.join(', ')}`);
    }

    return strengths.length > 0 ? strengths : ['No significant strengths identified for data science'];
  }

  private identifyMajorGaps(technical: any, experience: any, education: any): string[] {
    const gaps: string[] = [];

    // Technical gaps
    Object.entries(technical).forEach(([category, data]: [string, any]) => {
      if (data.score < 5 && data.missing.length > 0) {
        gaps.push(`Missing ${category} skills: ${data.missing.slice(0, 3).join(', ')}`);
      }
    });

    // Experience gaps
    if (experience.dataRelatedExperience.length === 0) {
      gaps.push('No direct data science or analytics experience');
    }

    // Education gaps
    if (education.relevantEducation.length === 0) {
      gaps.push('No quantitative or technical educational background');
    }

    return gaps.length > 0 ? gaps : ['Minor gaps in advanced specializations'];
  }

  private identifyIrrelevantElements(words: string[], content: string): string[] {
    const irrelevant: string[] = [];

    this.irrelevantFields.forEach(field => {
      if (content.includes(field)) {
        irrelevant.push(`${field} experience/background`);
      }
    });

    return irrelevant;
  }

  private generateRecommendations(technical: any, experience: any, education: any, score: number): string[] {
    const recommendations: string[] = [];

    if (score <= 3) {
      recommendations.push('Complete a comprehensive data science program or bootcamp');
      recommendations.push('Learn Python programming from scratch');
      recommendations.push('Study statistics and probability fundamentals');
      recommendations.push('Build 3-5 data science projects for portfolio');
    } else if (score <= 6) {
      // Technical recommendations
      Object.entries(technical).forEach(([category, data]: [string, any]) => {
        if (data.score < 6 && data.missing.length > 0) {
          recommendations.push(`Strengthen ${category}: focus on ${data.missing.slice(0, 2).join(' and ')}`);
        }
      });

      if (experience.dataRelatedExperience.length === 0) {
        recommendations.push('Gain hands-on experience through internships or entry-level analyst roles');
      }
    } else {
      recommendations.push('Focus on advanced specializations (deep learning, MLOps, etc.)');
      recommendations.push('Contribute to open-source data science projects');
      recommendations.push('Obtain advanced certifications in cloud platforms');
    }

    return recommendations;
  }

  private assessJobReadiness(score: number, technical: any, experience: any): string {
    if (score <= 2) {
      return 'NOT READY: Candidate lacks fundamental data science skills and knowledge. Requires 12-18 months of intensive training.';
    } else if (score <= 4) {
      return 'BEGINNER LEVEL: Some basic skills present but significant gaps remain. Suitable only for entry-level positions with extensive mentoring. Needs 6-12 months additional preparation.';
    } else if (score <= 6) {
      return 'JUNIOR READY: Has foundational skills but needs practical experience. Suitable for junior data scientist or analyst roles with supervision. Recommend 3-6 months focused skill development.';
    } else if (score <= 8) {
      return 'MID-LEVEL READY: Strong technical foundation with relevant experience. Ready for mid-level data science positions. Minor skill gaps can be addressed on the job.';
    } else {
      return 'SENIOR READY: Excellent technical skills and experience. Ready for senior data science roles and can contribute immediately to complex projects.';
    }
  }
}

export const dataScienceAnalyzer = new DataScienceResumeAnalyzer();
export type { DataScienceAnalysis };