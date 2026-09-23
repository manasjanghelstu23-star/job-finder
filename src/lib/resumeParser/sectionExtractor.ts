/**
 * Phase 3: Resume Section Extractor
 * 
 * Modular parser to extract structured information from raw text.
 * Uses a heuristic/regex approach to segment the resume.
 * This can be swapped with an LLM-based parser later.
 */

export interface StructuredResume {
  contactInfo: {
    email?: string;
    phone?: string;
    links?: string[];
  };
  summary: string;
  education: string[];
  experience: string[];
  skills: string[];
  projects: string[];
  certifications: string[];
  rawSections: Record<string, string>; // Preserving the original extracted text per section
  confidence: number;
}

export class ResumeParser {
  
  static extractStructuredData(rawText: string): StructuredResume {
    const lines = rawText.split('\n');
    
    const sections: Record<string, string> = {
      summary: "",
      education: "",
      experience: "",
      skills: "",
      projects: "",
      certifications: "",
      unknown: ""
    };

    let currentSection = "unknown";

    // Common section headers (case insensitive regex, optional trailing colon)
    const headerRegexes = [
      { id: "summary", regex: /^(summary|profile|professional summary|about me|objective)[:]?\s*$/i },
      { id: "education", regex: /^(education|academic background|academics)[:]?\s*$/i },
      { id: "experience", regex: /^(experience|work experience|employment|professional experience|internships|history)[:]?\s*$/i },
      { id: "skills", regex: /^(skills|technical skills|technologies|core competencies|tools & technologies|technical competencies)[:]?\s*$/i },
      { id: "projects", regex: /^(projects|personal projects|academic projects|key projects)[:]?\s*$/i },
      { id: "certifications", regex: /^(certifications|certificates|licenses|achievements)[:]?\s*$/i },
    ];

    // Simple line-by-line heuristic parsing
    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) continue;

      let isHeader = false;
      for (const header of headerRegexes) {
        if (header.regex.test(cleanLine)) {
          currentSection = header.id;
          isHeader = true;
          break;
        }
      }

      // Special case: if line is very short and ALL CAPS or ends with colon, it might be an unknown header
      if (!isHeader && cleanLine.length < 25 && (/^[A-Z\s:]+$/.test(cleanLine) || cleanLine.endsWith(':'))) {
        for (const header of headerRegexes) {
          if (cleanLine.toLowerCase().includes(header.id)) {
            currentSection = header.id;
            isHeader = true;
            break;
          }
        }
      }

      if (!isHeader) {
        sections[currentSection] += cleanLine + "\n";
      }
    }

    // Basic Contact Info Extraction
    const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g);
    const linkMatches = rawText.match(/(https?:\/\/[^\s]+|github\.com\/[^\s,|]+|linkedin\.com\/in\/[^\s,|]+)/gi) || [];

    return {
      contactInfo: {
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        links: Array.from(new Set(linkMatches.map(l => l.replace(/[,|]$/, ''))))
      },
      summary: sections.summary.trim(),
      education: this.splitIntoBullets(sections.education),
      experience: this.splitIntoBullets(sections.experience),
      skills: this.splitIntoBullets(sections.skills),
      projects: this.splitIntoBullets(sections.projects),
      certifications: this.splitIntoBullets(sections.certifications),
      rawSections: sections,
      confidence: 0.6 // Heuristic confidence is medium-low
    };
  }

  // Helper to split a block of text into distinct items/bullets
  private static splitIntoBullets(text: string): string[] {
    if (!text.trim()) return [];
    // Split by common bullet points or empty lines
    return text
      .split(/(?:^|\n)(?:[-•*]\s+|\n{2,})/)
      .map(item => item.replace(/[\n\r]+/g, ' ').trim())
      .filter(item => item.length > 5);
  }
}
