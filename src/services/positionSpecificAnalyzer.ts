interface PositionSpecificAnalysis {
  overallRelevanceScore: number; // 1-10 scale
  positionTitle: string;
  keyStrengths: string[];
  majorGaps: string[];
  irrelevantElements: string[];
  improvementRecommendations: string[];
  jobReadinessAssessment: string;
  technicalSkillsBreakdown: {
    [category: string]: { 
      present: string[]; 
      missing: string[]; 
      score: number;
      category: string;
    };
  };
  experienceRelevance: {
    relevantExperience: string[];
    transferableExperience: string[];
    irrelevantExperience: string[];
    experienceScore: number;
  };
  educationAssessment: {
    relevantEducation: string[];
    supportiveEducation: string[];
    irrelevantEducation: string[];
    educationScore: number;
  };
  industryAlignment: {
    keywords: string[];
    terminology: string[];
    certifications: string[];
    alignmentScore: number;
  };
  atsOptimization: {
    suggestions: string[];
    missingKeywords: string[];
    score: number;
  };
}

class PositionSpecificResumeAnalyzer {
  private positionRequirements: { [key: string]: any } = {
    // Software Engineering Positions
    'software engineer': {
      technicalSkills: {
        programming: {
          essential: ['javascript', 'python', 'java', 'c++', 'c#'],
          important: ['typescript', 'go', 'rust', 'kotlin', 'swift'],
          bonus: ['assembly', 'scala', 'haskell', 'clojure']
        },
        frameworks: {
          essential: ['react', 'angular', 'vue', 'node.js', 'express'],
          important: ['spring', 'django', 'flask', 'laravel', 'rails'],
          bonus: ['next.js', 'nuxt.js', 'fastapi', 'nestjs']
        },
        tools: {
          essential: ['git', 'docker', 'linux', 'sql', 'rest api'],
          important: ['kubernetes', 'aws', 'azure', 'jenkins', 'webpack'],
          bonus: ['terraform', 'ansible', 'prometheus', 'grafana']
        },
        databases: {
          essential: ['mysql', 'postgresql', 'mongodb'],
          important: ['redis', 'elasticsearch', 'cassandra'],
          bonus: ['neo4j', 'influxdb', 'dynamodb']
        }
      },
      experienceKeywords: ['software development', 'programming', 'coding', 'application development', 'system design', 'api development', 'full stack', 'backend', 'frontend'],
      educationFields: ['computer science', 'software engineering', 'information technology', 'computer engineering', 'mathematics'],
      industryKeywords: ['agile', 'scrum', 'ci/cd', 'microservices', 'scalability', 'performance optimization', 'code review', 'testing', 'debugging'],
      certifications: ['aws certified', 'azure certified', 'google cloud', 'oracle certified', 'microsoft certified'],
      irrelevantFields: ['interior design', 'fashion', 'culinary', 'hospitality', 'construction', 'civil engineering', 'mechanical engineering']
    },

    // Data Science Positions
    'data scientist': {
      technicalSkills: {
        programming: {
          essential: ['python', 'r', 'sql'],
          important: ['scala', 'java', 'julia'],
          bonus: ['matlab', 'sas', 'spark']
        },
        libraries: {
          essential: ['pandas', 'numpy', 'scikit-learn', 'matplotlib'],
          important: ['tensorflow', 'pytorch', 'keras', 'seaborn'],
          bonus: ['xgboost', 'lightgbm', 'plotly', 'bokeh']
        },
        tools: {
          essential: ['jupyter', 'git', 'excel'],
          important: ['tableau', 'power bi', 'aws', 'docker'],
          bonus: ['airflow', 'mlflow', 'kubeflow', 'databricks']
        },
        statistics: {
          essential: ['statistics', 'probability', 'hypothesis testing'],
          important: ['regression', 'classification', 'clustering', 'time series'],
          bonus: ['bayesian statistics', 'causal inference', 'experimental design']
        }
      },
      experienceKeywords: ['data analysis', 'machine learning', 'statistical modeling', 'data mining', 'predictive analytics', 'business intelligence', 'research'],
      educationFields: ['data science', 'statistics', 'mathematics', 'computer science', 'physics', 'economics', 'engineering'],
      industryKeywords: ['machine learning', 'deep learning', 'neural networks', 'feature engineering', 'model validation', 'a/b testing', 'data visualization'],
      certifications: ['google data analytics', 'ibm data science', 'microsoft azure data scientist', 'aws machine learning'],
      irrelevantFields: ['interior design', 'fashion', 'culinary', 'hospitality', 'construction', 'retail sales']
    },

    // Product Management Positions
    'product manager': {
      technicalSkills: {
        analytics: {
          essential: ['google analytics', 'mixpanel', 'amplitude'],
          important: ['tableau', 'sql', 'excel'],
          bonus: ['python', 'r', 'looker']
        },
        tools: {
          essential: ['jira', 'confluence', 'slack', 'figma'],
          important: ['miro', 'notion', 'asana', 'trello'],
          bonus: ['productboard', 'pendo', 'fullstory']
        },
        frameworks: {
          essential: ['agile', 'scrum', 'kanban'],
          important: ['lean startup', 'design thinking', 'jobs-to-be-done'],
          bonus: ['okrs', 'rice framework', 'kano model']
        }
      },
      experienceKeywords: ['product management', 'product strategy', 'roadmap', 'user research', 'market analysis', 'stakeholder management', 'cross-functional'],
      educationFields: ['business', 'marketing', 'computer science', 'engineering', 'economics', 'psychology'],
      industryKeywords: ['user experience', 'product-market fit', 'go-to-market', 'customer journey', 'mvp', 'product lifecycle', 'competitive analysis'],
      certifications: ['certified scrum product owner', 'product management certificate', 'google product management'],
      irrelevantFields: ['construction', 'civil engineering', 'mechanical engineering', 'interior design']
    },

    // Marketing Positions
    'marketing manager': {
      technicalSkills: {
        digital: {
          essential: ['google analytics', 'facebook ads', 'google ads'],
          important: ['hubspot', 'mailchimp', 'hootsuite', 'canva'],
          bonus: ['salesforce', 'marketo', 'pardot', 'adobe creative suite']
        },
        analytics: {
          essential: ['excel', 'google sheets'],
          important: ['tableau', 'power bi', 'sql'],
          bonus: ['python', 'r', 'google data studio']
        },
        content: {
          essential: ['content creation', 'copywriting', 'social media'],
          important: ['seo', 'sem', 'email marketing', 'video editing'],
          bonus: ['graphic design', 'photography', 'influencer marketing']
        }
      },
      experienceKeywords: ['marketing', 'digital marketing', 'brand management', 'campaign management', 'lead generation', 'content marketing', 'social media marketing'],
      educationFields: ['marketing', 'business', 'communications', 'journalism', 'advertising', 'psychology'],
      industryKeywords: ['brand awareness', 'customer acquisition', 'conversion rate', 'roi', 'kpi', 'attribution', 'funnel optimization'],
      certifications: ['google ads certified', 'facebook blueprint', 'hubspot certified', 'google analytics certified'],
      irrelevantFields: ['construction', 'civil engineering', 'mechanical engineering', 'culinary']
    },

    // Financial Analyst Positions
    'financial analyst': {
      technicalSkills: {
        software: {
          essential: ['excel', 'powerpoint', 'word'],
          important: ['bloomberg', 'factset', 'quickbooks', 'sap'],
          bonus: ['python', 'r', 'vba', 'sql']
        },
        analysis: {
          essential: ['financial modeling', 'valuation', 'budgeting', 'forecasting'],
          important: ['dcf', 'comparable analysis', 'sensitivity analysis'],
          bonus: ['monte carlo', 'options pricing', 'risk modeling']
        },
        reporting: {
          essential: ['financial statements', 'variance analysis', 'kpi reporting'],
          important: ['dashboard creation', 'data visualization'],
          bonus: ['tableau', 'power bi', 'qlik']
        }
      },
      experienceKeywords: ['financial analysis', 'investment analysis', 'budgeting', 'forecasting', 'financial planning', 'corporate finance', 'investment banking'],
      educationFields: ['finance', 'accounting', 'economics', 'business', 'mathematics', 'statistics'],
      industryKeywords: ['financial statements', 'cash flow', 'roi', 'npv', 'irr', 'wacc', 'ebitda', 'financial ratios'],
      certifications: ['cfa', 'frm', 'cpa', 'chartered financial analyst'],
      irrelevantFields: ['interior design', 'fashion', 'culinary', 'hospitality', 'construction']
    },

    // UX/UI Designer Positions
    'ux designer': {
      technicalSkills: {
        design: {
          essential: ['figma', 'sketch', 'adobe xd', 'invision'],
          important: ['photoshop', 'illustrator', 'principle', 'framer'],
          bonus: ['after effects', 'cinema 4d', 'blender']
        },
        research: {
          essential: ['user research', 'usability testing', 'personas', 'user journey mapping'],
          important: ['a/b testing', 'surveys', 'interviews', 'card sorting'],
          bonus: ['eye tracking', 'heat mapping', 'analytics']
        },
        prototyping: {
          essential: ['wireframing', 'prototyping', 'mockups'],
          important: ['interactive prototypes', 'design systems'],
          bonus: ['html', 'css', 'javascript']
        }
      },
      experienceKeywords: ['ux design', 'ui design', 'user experience', 'user interface', 'interaction design', 'visual design', 'product design'],
      educationFields: ['design', 'human-computer interaction', 'psychology', 'computer science', 'fine arts', 'graphic design'],
      industryKeywords: ['user-centered design', 'design thinking', 'accessibility', 'responsive design', 'information architecture', 'usability'],
      certifications: ['google ux design certificate', 'adobe certified expert', 'ixdf certification'],
      irrelevantFields: ['construction', 'civil engineering', 'mechanical engineering', 'culinary']
    },

    // Sales Positions
    'sales manager': {
      technicalSkills: {
        crm: {
          essential: ['salesforce', 'hubspot', 'pipedrive'],
          important: ['zoho', 'microsoft dynamics', 'freshsales'],
          bonus: ['pardot', 'marketo', 'outreach']
        },
        analytics: {
          essential: ['excel', 'google sheets'],
          important: ['tableau', 'power bi', 'google analytics'],
          bonus: ['sql', 'python', 'r']
        },
        communication: {
          essential: ['email marketing', 'linkedin sales navigator', 'zoom'],
          important: ['slack', 'microsoft teams', 'calendly'],
          bonus: ['video editing', 'presentation software']
        }
      },
      experienceKeywords: ['sales', 'business development', 'account management', 'lead generation', 'client relations', 'revenue growth', 'territory management'],
      educationFields: ['business', 'marketing', 'communications', 'psychology', 'economics'],
      industryKeywords: ['quota attainment', 'pipeline management', 'closing ratio', 'customer acquisition', 'relationship building', 'negotiation'],
      certifications: ['salesforce certified', 'hubspot sales certification', 'challenger sale'],
      irrelevantFields: ['construction', 'civil engineering', 'mechanical engineering', 'interior design']
    }
  };

  analyzeResume(resumeText: string, targetPosition: string): PositionSpecificAnalysis {
    const words = resumeText.toLowerCase().split(/\s+/);
    const content = resumeText.toLowerCase();
    const position = this.normalizePosition(targetPosition);

    // Get position requirements or create generic ones
    const requirements = this.getPositionRequirements(position);

    // Check for completely irrelevant fields first
    const irrelevantFieldMatches = requirements.irrelevantFields?.filter((field: string) => 
      content.includes(field) || words.some(word => word.includes(field))
    ) || [];

    if (irrelevantFieldMatches.length > 2) {
      return this.generateIrrelevantFieldAnalysis(irrelevantFieldMatches, resumeText, targetPosition);
    }

    // Perform detailed analysis
    const technicalSkills = this.analyzeTechnicalSkills(words, content, requirements);
    const experience = this.analyzeExperience(words, content, requirements);
    const education = this.analyzeEducation(words, content, requirements);
    const industryAlignment = this.analyzeIndustryAlignment(words, content, requirements);
    const atsOptimization = this.analyzeATSOptimization(words, content, requirements);

    const overallScore = this.calculateOverallScore(technicalSkills, experience, education, industryAlignment);
    
    return {
      overallRelevanceScore: overallScore,
      positionTitle: targetPosition,
      keyStrengths: this.identifyKeyStrengths(technicalSkills, experience, education, industryAlignment, targetPosition),
      majorGaps: this.identifyMajorGaps(technicalSkills, experience, education, requirements, targetPosition),
      irrelevantElements: this.identifyIrrelevantElements(words, content, requirements),
      improvementRecommendations: this.generateRecommendations(technicalSkills, experience, education, overallScore, targetPosition, requirements),
      jobReadinessAssessment: this.assessJobReadiness(overallScore, technicalSkills, experience, targetPosition),
      technicalSkillsBreakdown: technicalSkills,
      experienceRelevance: experience,
      educationAssessment: education,
      industryAlignment,
      atsOptimization
    };
  }

  private normalizePosition(position: string): string {
    const normalized = position.toLowerCase().trim();
    
    // Map variations to standard positions
    const positionMappings: { [key: string]: string } = {
      'software developer': 'software engineer',
      'full stack developer': 'software engineer',
      'frontend developer': 'software engineer',
      'backend developer': 'software engineer',
      'web developer': 'software engineer',
      'data analyst': 'data scientist',
      'ml engineer': 'data scientist',
      'machine learning engineer': 'data scientist',
      'product owner': 'product manager',
      'digital marketing manager': 'marketing manager',
      'marketing specialist': 'marketing manager',
      'financial advisor': 'financial analyst',
      'investment analyst': 'financial analyst',
      'ui designer': 'ux designer',
      'product designer': 'ux designer',
      'sales representative': 'sales manager',
      'account executive': 'sales manager'
    };

    return positionMappings[normalized] || normalized;
  }

  private getPositionRequirements(position: string) {
    // Return specific requirements if available, otherwise create generic ones
    if (this.positionRequirements[position]) {
      return this.positionRequirements[position];
    }

    // Generate generic requirements based on position keywords
    return this.generateGenericRequirements(position);
  }

  private generateGenericRequirements(position: string) {
    const words = position.toLowerCase().split(/\s+/);
    
    // Create basic requirements structure
    const requirements = {
      technicalSkills: {
        core: {
          essential: [],
          important: [],
          bonus: []
        }
      },
      experienceKeywords: words.concat([position.toLowerCase(), 'professional experience']),
      educationFields: ['business', 'relevant field', 'bachelor degree'],
      industryKeywords: ['professional', 'industry knowledge', 'best practices'],
      certifications: ['relevant certifications', 'professional development'],
      irrelevantFields: ['completely unrelated fields']
    };

    // Add position-specific keywords based on common patterns
    if (words.some(w => ['engineer', 'developer', 'programmer'].includes(w))) {
      requirements.technicalSkills.core.essential = ['programming', 'software development', 'technical skills'];
      requirements.industryKeywords = ['software development', 'programming', 'technical expertise'];
    } else if (words.some(w => ['manager', 'director', 'lead'].includes(w))) {
      requirements.technicalSkills.core.essential = ['leadership', 'management', 'strategy'];
      requirements.industryKeywords = ['leadership', 'team management', 'strategic planning'];
    } else if (words.some(w => ['analyst', 'research'].includes(w))) {
      requirements.technicalSkills.core.essential = ['analysis', 'research', 'data analysis'];
      requirements.industryKeywords = ['analytical thinking', 'research methodology', 'data interpretation'];
    }

    return requirements;
  }

  private generateIrrelevantFieldAnalysis(irrelevantFields: string[], resumeText: string, targetPosition: string): PositionSpecificAnalysis {
    return {
      overallRelevanceScore: 1,
      positionTitle: targetPosition,
      keyStrengths: [],
      majorGaps: [
        `No ${targetPosition.toLowerCase()} technical skills identified`,
        `No relevant analytical or professional experience for ${targetPosition}`,
        `No educational background aligned with ${targetPosition} requirements`,
        `Complete field mismatch for ${targetPosition} position`,
        `Missing all core competencies required for ${targetPosition} roles`
      ],
      irrelevantElements: irrelevantFields.map(field => 
        `Background in ${field} - not relevant to ${targetPosition}`
      ),
      improvementRecommendations: [
        `Complete comprehensive ${targetPosition.toLowerCase()} training program or degree`,
        `Learn core technical skills required for ${targetPosition} positions`,
        `Gain relevant experience through internships, projects, or entry-level roles in the field`,
        `Build a portfolio demonstrating ${targetPosition.toLowerCase()} capabilities`,
        `Obtain industry-relevant certifications for ${targetPosition}`,
        `Consider career transition planning with professional guidance`
      ],
      jobReadinessAssessment: `NOT READY: This resume shows no relevance to ${targetPosition} positions. Candidate needs extensive retraining and skill development before being considered for any ${targetPosition.toLowerCase()} role. Recommend 12-24 months of intensive study and practice in the field.`,
      technicalSkillsBreakdown: {
        core: { present: [], missing: [`Core ${targetPosition} skills`], score: 0, category: 'Core Skills' }
      },
      experienceRelevance: {
        relevantExperience: [],
        transferableExperience: [],
        irrelevantExperience: irrelevantFields,
        experienceScore: 0
      },
      educationAssessment: {
        relevantEducation: [],
        supportiveEducation: [],
        irrelevantEducation: irrelevantFields,
        educationScore: 0
      },
      industryAlignment: {
        keywords: [],
        terminology: [],
        certifications: [],
        alignmentScore: 0
      },
      atsOptimization: {
        suggestions: [`Add ${targetPosition.toLowerCase()} keywords`, 'Complete career transition first'],
        missingKeywords: [`${targetPosition} skills`, 'Relevant experience'],
        score: 0
      }
    };
  }

  private analyzeTechnicalSkills(words: string[], content: string, requirements: any) {
    const skillsBreakdown: any = {};

    if (requirements.technicalSkills) {
      Object.entries(requirements.technicalSkills).forEach(([category, skills]: [string, any]) => {
        let categoryScore = 0;
        let totalPossible = 0;
        const present: string[] = [];
        const missing: string[] = [];

        ['essential', 'important', 'bonus'].forEach(level => {
          const skillList = skills[level] || [];
          const weight = level === 'essential' ? 3 : level === 'important' ? 2 : 1;
          
          skillList.forEach((skill: string) => {
            totalPossible += weight;
            const hasSkill = words.some(word => word.includes(skill.toLowerCase())) || 
                            content.includes(skill.toLowerCase());
            
            if (hasSkill) {
              present.push(skill);
              categoryScore += weight;
            } else if (level === 'essential' || level === 'important') {
              missing.push(skill);
            }
          });
        });

        skillsBreakdown[category] = {
          present,
          missing,
          score: totalPossible > 0 ? Math.round((categoryScore / totalPossible) * 10) : 0,
          category: category.charAt(0).toUpperCase() + category.slice(1)
        };
      });
    }

    return skillsBreakdown;
  }

  private analyzeExperience(words: string[], content: string, requirements: any) {
    const relevantExp: string[] = [];
    const transferableExp: string[] = [];
    const irrelevantExp: string[] = [];

    // Check for relevant experience
    if (requirements.experienceKeywords) {
      requirements.experienceKeywords.forEach((keyword: string) => {
        if (content.includes(keyword.toLowerCase())) {
          relevantExp.push(keyword);
        }
      });
    }

    // Check for transferable skills
    const transferableKeywords = [
      'leadership', 'management', 'analysis', 'problem solving', 'communication',
      'project management', 'team work', 'customer service', 'training'
    ];

    transferableKeywords.forEach(keyword => {
      if (words.some(word => word.includes(keyword.toLowerCase()))) {
        transferableExp.push(keyword);
      }
    });

    // Check for irrelevant experience
    if (requirements.irrelevantFields) {
      requirements.irrelevantFields.forEach((field: string) => {
        if (content.includes(field)) {
          irrelevantExp.push(field);
        }
      });
    }

    const experienceScore = Math.min(10, 
      Math.max(0, (relevantExp.length * 3) + (transferableExp.length * 1) - (irrelevantExp.length * 2))
    );

    return {
      relevantExperience: relevantExp,
      transferableExperience: transferableExp,
      irrelevantExperience: irrelevantExp,
      experienceScore
    };
  }

  private analyzeEducation(words: string[], content: string, requirements: any) {
    const relevantEd: string[] = [];
    const supportiveEd: string[] = [];
    const irrelevantEd: string[] = [];

    // Check for relevant education
    if (requirements.educationFields) {
      requirements.educationFields.forEach((field: string) => {
        if (content.includes(field.toLowerCase())) {
          relevantEd.push(field);
        }
      });
    }

    // Check for degrees
    const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'degree', 'diploma', 'certificate'];
    degreeKeywords.forEach(degree => {
      if (words.some(word => word.includes(degree))) {
        supportiveEd.push(degree);
      }
    });

    // Check for irrelevant education
    if (requirements.irrelevantFields) {
      requirements.irrelevantFields.forEach((field: string) => {
        if (content.includes(field)) {
          irrelevantEd.push(field);
        }
      });
    }

    const educationScore = Math.min(10, 
      Math.max(0, (relevantEd.length * 4) + (supportiveEd.length * 1) - (irrelevantEd.length * 3))
    );

    return {
      relevantEducation: relevantEd,
      supportiveEducation: supportiveEd,
      irrelevantEducation: irrelevantEd,
      educationScore
    };
  }

  private analyzeIndustryAlignment(words: string[], content: string, requirements: any) {
    const keywords: string[] = [];
    const terminology: string[] = [];
    const certifications: string[] = [];

    // Check for industry keywords
    if (requirements.industryKeywords) {
      requirements.industryKeywords.forEach((keyword: string) => {
        if (content.includes(keyword.toLowerCase())) {
          keywords.push(keyword);
        }
      });
    }

    // Check for certifications
    if (requirements.certifications) {
      requirements.certifications.forEach((cert: string) => {
        if (content.includes(cert.toLowerCase())) {
          certifications.push(cert);
        }
      });
    }

    const alignmentScore = Math.min(10, 
      (keywords.length * 2) + (terminology.length * 1) + (certifications.length * 3)
    );

    return {
      keywords,
      terminology,
      certifications,
      alignmentScore
    };
  }

  private analyzeATSOptimization(words: string[], content: string, requirements: any) {
    const suggestions: string[] = [];
    const missingKeywords: string[] = [];

    // Check for missing essential keywords
    if (requirements.technicalSkills) {
      Object.values(requirements.technicalSkills).forEach((skillCategory: any) => {
        if (skillCategory.essential) {
          skillCategory.essential.forEach((skill: string) => {
            if (!content.includes(skill.toLowerCase())) {
              missingKeywords.push(skill);
            }
          });
        }
      });
    }

    // Generate ATS suggestions
    if (missingKeywords.length > 0) {
      suggestions.push('Add missing technical keywords throughout resume');
      suggestions.push('Include relevant skills in a dedicated skills section');
    }

    if (requirements.industryKeywords) {
      const missingIndustryTerms = requirements.industryKeywords.filter((keyword: string) => 
        !content.includes(keyword.toLowerCase())
      );
      
      if (missingIndustryTerms.length > 0) {
        suggestions.push('Incorporate industry-specific terminology');
        suggestions.push('Use action verbs relevant to the field');
      }
    }

    const score = Math.max(0, 10 - missingKeywords.length);

    return {
      suggestions,
      missingKeywords,
      score
    };
  }

  private calculateOverallScore(technical: any, experience: any, education: any, industry: any): number {
    const techScores = Object.values(technical).map((skill: any) => skill.score);
    const techAvg = techScores.length > 0 ? techScores.reduce((a: number, b: number) => a + b, 0) / techScores.length : 0;
    
    const expScore = experience.experienceScore;
    const eduScore = education.educationScore;
    const indScore = industry.alignmentScore;

    // Weighted average: Technical 40%, Experience 30%, Education 15%, Industry 15%
    const weightedScore = (techAvg * 0.4) + (expScore * 0.3) + (eduScore * 0.15) + (indScore * 0.15);
    
    return Math.round(Math.max(1, Math.min(10, weightedScore)));
  }

  private identifyKeyStrengths(technical: any, experience: any, education: any, industry: any, position: string): string[] {
    const strengths: string[] = [];

    // Technical strengths
    Object.entries(technical).forEach(([category, data]: [string, any]) => {
      if (data.score >= 7 && data.present.length > 0) {
        strengths.push(`Strong ${category} skills for ${position}: ${data.present.slice(0, 3).join(', ')}`);
      }
    });

    // Experience strengths
    if (experience.relevantExperience.length > 0) {
      strengths.push(`Relevant ${position.toLowerCase()} experience: ${experience.relevantExperience.slice(0, 3).join(', ')}`);
    }

    // Education strengths
    if (education.relevantEducation.length > 0) {
      strengths.push(`Educational background aligned with ${position}: ${education.relevantEducation.join(', ')}`);
    }

    // Industry alignment strengths
    if (industry.certifications.length > 0) {
      strengths.push(`Industry certifications: ${industry.certifications.join(', ')}`);
    }

    return strengths.length > 0 ? strengths : [`Limited strengths identified for ${position} role`];
  }

  private identifyMajorGaps(technical: any, experience: any, education: any, requirements: any, position: string): string[] {
    const gaps: string[] = [];

    // Technical gaps
    Object.entries(technical).forEach(([category, data]: [string, any]) => {
      if (data.score < 5 && data.missing.length > 0) {
        gaps.push(`Missing ${category} skills for ${position}: ${data.missing.slice(0, 3).join(', ')}`);
      }
    });

    // Experience gaps
    if (experience.relevantExperience.length === 0) {
      gaps.push(`No direct ${position.toLowerCase()} experience demonstrated`);
    }

    // Education gaps
    if (education.relevantEducation.length === 0 && requirements.educationFields) {
      gaps.push(`Educational background not aligned with typical ${position} requirements`);
    }

    return gaps.length > 0 ? gaps : [`Minor gaps in advanced ${position.toLowerCase()} specializations`];
  }

  private identifyIrrelevantElements(words: string[], content: string, requirements: any): string[] {
    const irrelevant: string[] = [];

    if (requirements.irrelevantFields) {
      requirements.irrelevantFields.forEach((field: string) => {
        if (content.includes(field)) {
          irrelevant.push(`${field} experience/background`);
        }
      });
    }

    return irrelevant;
  }

  private generateRecommendations(technical: any, experience: any, education: any, score: number, position: string, requirements: any): string[] {
    const recommendations: string[] = [];

    if (score <= 3) {
      recommendations.push(`Complete comprehensive ${position.toLowerCase()} training program or degree`);
      recommendations.push(`Learn core technical skills required for ${position} roles`);
      recommendations.push(`Gain relevant experience through internships or entry-level positions`);
      recommendations.push(`Build a portfolio demonstrating ${position.toLowerCase()} capabilities`);
    } else if (score <= 6) {
      // Technical recommendations
      Object.entries(technical).forEach(([category, data]: [string, any]) => {
        if (data.score < 6 && data.missing.length > 0) {
          recommendations.push(`Strengthen ${category} skills: focus on ${data.missing.slice(0, 2).join(' and ')}`);
        }
      });

      if (experience.relevantExperience.length === 0) {
        recommendations.push(`Gain hands-on ${position.toLowerCase()} experience through projects or internships`);
      }

      if (requirements.certifications && requirements.certifications.length > 0) {
        recommendations.push(`Obtain relevant certifications: ${requirements.certifications.slice(0, 2).join(', ')}`);
      }
    } else {
      recommendations.push(`Focus on advanced ${position.toLowerCase()} specializations`);
      recommendations.push(`Contribute to industry projects or open-source initiatives`);
      recommendations.push(`Pursue senior-level certifications and continuous learning`);
      recommendations.push(`Build thought leadership in ${position.toLowerCase()} field`);
    }

    return recommendations;
  }

  private assessJobReadiness(score: number, technical: any, experience: any, position: string): string {
    if (score <= 2) {
      return `NOT READY: Candidate lacks fundamental ${position.toLowerCase()} skills and knowledge. Requires 12-24 months of intensive training and education.`;
    } else if (score <= 4) {
      return `BEGINNER LEVEL: Some basic skills present but significant gaps remain. Suitable only for entry-level ${position.toLowerCase()} positions with extensive mentoring. Needs 6-12 months additional preparation.`;
    } else if (score <= 6) {
      return `JUNIOR READY: Has foundational skills but needs practical experience. Suitable for junior ${position.toLowerCase()} roles with supervision. Recommend 3-6 months focused skill development.`;
    } else if (score <= 8) {
      return `MID-LEVEL READY: Strong foundation with relevant experience. Ready for mid-level ${position.toLowerCase()} positions. Minor skill gaps can be addressed on the job.`;
    } else {
      return `SENIOR READY: Excellent skills and experience. Ready for senior ${position.toLowerCase()} roles and can contribute immediately to complex projects.`;
    }
  }
}

export const positionSpecificAnalyzer = new PositionSpecificResumeAnalyzer();
export type { PositionSpecificAnalysis };