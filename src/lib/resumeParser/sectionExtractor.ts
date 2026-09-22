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

    // Common section headers (case insensitive regex)
    const headerRegexes = [
      { id: "summary", regex: /^(summary|profile|about me|objective)\s*$/i },
      { id: "education", regex: /^(education|academic background|academics)\s*$/i },
      { id: "experience", regex: /^(experience|work experience|employment|professional experience|history)\s*$/i },
      { id: "skills", regex: /^(skills|technical skills|core competencies|technologies)\s*$/i },
      { id: "projects", regex: /^(projects|personal projects|academic projects)\s*$/i },
      { id: "certifications", regex: /^(certifications|certificates|licenses)\s*$/i },
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

      // Special case: if line is very short and ALL CAPS, it might be an unknown header
      if (!isHeader && cleanLine.length < 20 && /^[A-Z\s]+$/.test(cleanLine)) {
        // Skip it or assign to unknown if we want to be strict, 
        // but for now we just append it to the current section.
      }

      if (!isHeader) {
        sections[currentSection] += cleanLine + "\n";
      }
    }

    // Basic Contact Info Extraction
    const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g);

    return {
      contactInfo: {
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        links: [] // URL extraction could go here
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
