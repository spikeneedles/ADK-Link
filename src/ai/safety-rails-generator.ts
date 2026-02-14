/**
 * Safety Rails Generator
 * Generates complete safety rail implementation for LLM projects
 */

export interface SafetyRailsConfig {
  // Content Safety
  contentFiltering: boolean;
  harmfulContentLevel: number;
  hateSpeechLevel: number;
  sexualContentLevel: number;
  violenceLevel: number;
  biasMitigation: number;
  
  // Security Armor
  inputSanitization: boolean;
  outputValidation: boolean;
  promptInjectionProtection: boolean;
  jailbreakDetection: boolean;
  hallucinationDetection: boolean;
  
  // Rate Limiting
  rateLimiting: boolean;
  requestsPerMinute: number;
  tokensPerRequest: number;
  
  // Privacy & Compliance
  piiDetection: boolean;
  dataRetention: boolean;
  auditLogging: boolean;
  gdprCompliance: boolean;
  
  // Model Behavior
  temperatureLimit: number;
  maxContextLength: number;
  blockExternalData: boolean;
  requireHumanReview: boolean;
}

/**
 * Generate complete safety rails package
 */
export function generateSafetyRails(config: SafetyRailsConfig) {
  const files: Record<string, string> = {};

  // 1. Main configuration file
  files['safety-config.json'] = JSON.stringify({
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    settings: config,
  }, null, 2);

  // 2. Python implementation
  files['safety_rails.py'] = generatePythonSafetyRails(config);
  
  // 3. TypeScript/JavaScript implementation
  files['safety-rails.ts'] = generateTypeScriptSafetyRails(config);
  
  // 4. Content filter implementation (only if content filtering enabled)
  if (config.contentFiltering) {
    files['content-filter.ts'] = generateContentFilter(config);
  }
  
  // 5. Input validator (only if sanitization enabled)
  if (config.inputSanitization) {
    files['input-validator.ts'] = generateInputValidator(config);
  }
  
  // 6. Rate limiter
  if (config.rateLimiting) {
    files['rate-limiter.ts'] = generateRateLimiter(config);
  }
  
  // 7. PII detector
  if (config.piiDetection) {
    files['pii-detector.ts'] = generatePIIDetector(config);
  }
  
  // 8. Audit logger
  if (config.auditLogging) {
    files['audit-logger.ts'] = generateAuditLogger(config);
  }
  
  // 9. Middleware (Express)
  files['middleware/safety-middleware.ts'] = generateExpressMiddleware(config);
  
  // 10. README with usage instructions
  files['SAFETY_RAILS_README.md'] = generateReadme(config);

  return files;
}

function generatePythonSafetyRails(config: SafetyRailsConfig): string {
  return `"""
Safety Rails for LLM Applications
Auto-generated safety enforcement system
"""

import re
import time
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import json

class SafetyRails:
    """Main safety rails enforcement system"""
    
    def __init__(self):
        self.config = ${JSON.stringify(config, null, 8)}
        self.request_history: Dict[str, List[float]] = {}
        
    def validate_input(self, text: str, user_id: str = "default") -> Tuple[bool, Optional[str]]:
        """Validate input text against all safety rules"""
        
        # Rate limiting check
        ${config.rateLimiting ? `
        if not self._check_rate_limit(user_id):
            return False, "Rate limit exceeded. Please wait before sending another request."
        ` : ''}
        
        # Input sanitization
        ${config.inputSanitization ? `
        if self._contains_injection_attempt(text):
            return False, "Potential security threat detected in input."
        ` : ''}
        
        # Content filtering
        ${config.contentFiltering ? `
        harmful_score = self._detect_harmful_content(text)
        if harmful_score > ${config.harmfulContentLevel / 100}:
            return False, "Content violates safety guidelines."
        ` : ''}
        
        # PII detection
        ${config.piiDetection ? `
        if self._contains_pii(text):
            return False, "Input contains personal identifiable information."
        ` : ''}
        
        return True, None
    
    ${config.rateLimiting ? `
    def _check_rate_limit(self, user_id: str) -> bool:
        """Check if user has exceeded rate limit"""
        now = time.time()
        if user_id not in self.request_history:
            self.request_history[user_id] = []
        
        # Remove requests older than 1 minute
        self.request_history[user_id] = [
            req_time for req_time in self.request_history[user_id]
            if now - req_time < 60
        ]
        
        # Check if limit exceeded
        if len(self.request_history[user_id]) >= ${config.requestsPerMinute}:
            return False
        
        self.request_history[user_id].append(now)
        return True
    ` : ''}
    
    ${config.promptInjectionProtection ? `
    def _contains_injection_attempt(self, text: str) -> bool:
        """Detect prompt injection attempts"""
        injection_patterns = [
            r'ignore (previous|above) (instructions|prompt)',
            r'system:',
            r'<\\|im_start\\|>',
            r'IMPORTANT: NEW INSTRUCTION',
            r'disregard',
        ]
        
        text_lower = text.lower()
        for pattern in injection_patterns:
            if re.search(pattern, text_lower):
                return True
        return False
    ` : ''}
    
    ${config.contentFiltering ? `
    def _detect_harmful_content(self, text: str) -> float:
        """Detect harmful content (simplified implementation)"""
        harmful_keywords = [
            'violence', 'weapon', 'bomb', 'attack', 'kill', 'harm',
            'hate', 'discriminate', 'racist', 'sexist',
        ]
        
        text_lower = text.lower()
        count = sum(1 for keyword in harmful_keywords if keyword in text_lower)
        return min(count / 3.0, 1.0)  # Normalize to 0-1
    ` : ''}
    
    ${config.piiDetection ? `
    def _contains_pii(self, text: str) -> bool:
        """Detect personally identifiable information"""
        # Email pattern
        if re.search(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', text):
            return True
        
        # SSN pattern (US)
        if re.search(r'\\b\\d{3}-\\d{2}-\\d{4}\\b', text):
            return True
        
        # Credit card pattern
        if re.search(r'\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b', text):
            return True
        
        return False
    ` : ''}
    
    ${config.auditLogging ? `
    def log_request(self, user_id: str, input_text: str, output_text: str, success: bool):
        """Log request for audit trail"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "input_length": len(input_text),
            "output_length": len(output_text) if output_text else 0,
            "success": success,
        }
        
        # In production, write to file or database
        print(f"[AUDIT] {json.dumps(log_entry)}")
    ` : ''}

# Usage example
if __name__ == "__main__":
    rails = SafetyRails()
    
    # Test input
    test_input = "Hello, can you help me with my code?"
    is_valid, error = rails.validate_input(test_input, user_id="user123")
    
    if is_valid:
        print("✓ Input passed safety checks")
    else:
        print(f"✗ Safety check failed: {error}")
`;
}

function generateTypeScriptSafetyRails(config: SafetyRailsConfig): string {
  return `/**
 * Safety Rails for LLM Applications (TypeScript)
 * Auto-generated safety enforcement system
 */

export interface SafetyCheckResult {
  isValid: boolean;
  error?: string;
  score?: number;
}

export interface SafetyConfig {
  contentFiltering: boolean;
  harmfulContentLevel: number;
  inputSanitization: boolean;
  promptInjectionProtection: boolean;
  rateLimiting: boolean;
  requestsPerMinute: number;
  piiDetection: boolean;
  auditLogging: boolean;
}

export class SafetyRails {
  private config: SafetyConfig;
  private requestHistory: Map<string, number[]> = new Map();

  constructor() {
    this.config = ${JSON.stringify(config, null, 6)};
  }

  /**
   * Validate input text against all safety rules
   */
  async validateInput(text: string, userId: string = 'default'): Promise<SafetyCheckResult> {
    ${config.rateLimiting ? `
    // Rate limiting check
    if (!this.checkRateLimit(userId)) {
      return {
        isValid: false,
        error: 'Rate limit exceeded. Please wait before sending another request.',
      };
    }
    ` : ''}

    ${config.inputSanitization ? `
    // Input sanitization
    if (this.containsInjectionAttempt(text)) {
      return {
        isValid: false,
        error: 'Potential security threat detected in input.',
      };
    }
    ` : ''}

    ${config.contentFiltering ? `
    // Content filtering
    const harmfulScore = this.detectHarmfulContent(text);
    if (harmfulScore > ${config.harmfulContentLevel / 100}) {
      return {
        isValid: false,
        error: 'Content violates safety guidelines.',
        score: harmfulScore,
      };
    }
    ` : ''}

    ${config.piiDetection ? `
    // PII detection
    if (this.containsPII(text)) {
      return {
        isValid: false,
        error: 'Input contains personal identifiable information.',
      };
    }
    ` : ''}

    return { isValid: true };
  }

  ${config.rateLimiting ? `
  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requestHistory.get(userId) || [];

    // Remove requests older than 1 minute
    const recentRequests = userRequests.filter(time => now - time < 60000);
    
    // Check if limit exceeded
    if (recentRequests.length >= ${config.requestsPerMinute}) {
      return false;
    }

    recentRequests.push(now);
    this.requestHistory.set(userId, recentRequests);
    return true;
  }
  ` : ''}

  ${config.promptInjectionProtection ? `
  private containsInjectionAttempt(text: string): boolean {
    const injectionPatterns = [
      /ignore (previous|above) (instructions|prompt)/i,
      /system:/i,
      /<\\|im_start\\|>/i,
      /IMPORTANT: NEW INSTRUCTION/i,
      /disregard/i,
    ];

    return injectionPatterns.some(pattern => pattern.test(text));
  }
  ` : ''}

  ${config.contentFiltering ? `
  private detectHarmfulContent(text: string): number {
    const harmfulKeywords = [
      'violence', 'weapon', 'bomb', 'attack', 'kill', 'harm',
      'hate', 'discriminate', 'racist', 'sexist',
    ];

    const textLower = text.toLowerCase();
    const count = harmfulKeywords.filter(keyword => textLower.includes(keyword)).length;
    return Math.min(count / 3, 1.0); // Normalize to 0-1
  }
  ` : ''}

  ${config.piiDetection ? `
  private containsPII(text: string): boolean {
    // Email pattern
    if (/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/.test(text)) {
      return true;
    }

    // SSN pattern (US)
    if (/\\b\\d{3}-\\d{2}-\\d{4}\\b/.test(text)) {
      return true;
    }

    // Credit card pattern
    if (/\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b/.test(text)) {
      return true;
    }

    return false;
  }
  ` : ''}

  ${config.auditLogging ? `
  logRequest(userId: string, inputText: string, outputText: string, success: boolean): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      inputLength: inputText.length,
      outputLength: outputText?.length || 0,
      success,
    };

    // In production, write to file or database
    console.log('[AUDIT]', JSON.stringify(logEntry));
  }
  ` : ''}
}

// Export singleton instance
export const safetyRails = new SafetyRails();
`;
}

function generateContentFilter(config: SafetyRailsConfig): string {
  return `/**
 * Content Filter
 * Blocks harmful, offensive, or inappropriate content
 */

export interface ContentScore {
  overall: number;
  categories: {
    harmful: number;
    hateSpeech: number;
    sexual: number;
    violence: number;
  };
}

export class ContentFilter {
  private thresholds = {
    harmful: ${config.harmfulContentLevel / 100},
    hateSpeech: ${config.hateSpeechLevel / 100},
    sexual: ${config.sexualContentLevel / 100},
    violence: ${config.violenceLevel / 100},
  };

  /**
   * Analyze content and return safety scores
   */
  analyzeContent(text: string): ContentScore {
    const scores = {
      harmful: this.detectHarmful(text),
      hateSpeech: this.detectHateSpeech(text),
      sexual: this.detectSexualContent(text),
      violence: this.detectViolence(text),
    };

    const overall = Math.max(...Object.values(scores));

    return {
      overall,
      categories: scores,
    };
  }

  /**
   * Check if content passes safety thresholds
   */
  isContentSafe(text: string): boolean {
    const scores = this.analyzeContent(text);

    if (scores.categories.harmful > this.thresholds.harmful) return false;
    if (scores.categories.hateSpeech > this.thresholds.hateSpeech) return false;
    if (scores.categories.sexual > this.thresholds.sexual) return false;
    if (scores.categories.violence > this.thresholds.violence) return false;

    return true;
  }

  private detectHarmful(text: string): number {
    const keywords = ['harmful', 'dangerous', 'illegal', 'unethical'];
    return this.calculateScore(text, keywords);
  }

  private detectHateSpeech(text: string): number {
    const keywords = ['hate', 'discriminate', 'racist', 'sexist', 'bigot'];
    return this.calculateScore(text, keywords);
  }

  private detectSexualContent(text: string): number {
    const keywords = ['explicit', 'nsfw', 'adult'];
    return this.calculateScore(text, keywords);
  }

  private detectViolence(text: string): number {
    const keywords = ['violence', 'weapon', 'attack', 'kill', 'harm'];
    return this.calculateScore(text, keywords);
  }

  private calculateScore(text: string, keywords: string[]): number {
    const textLower = text.toLowerCase();
    const matches = keywords.filter(keyword => textLower.includes(keyword)).length;
    return Math.min(matches / keywords.length, 1.0);
  }
}

export const contentFilter = new ContentFilter();
`;
}

function generateInputValidator(config: SafetyRailsConfig): string {
  return `/**
 * Input Validator
 * Validates and sanitizes user input
 */

export interface ValidationResult {
  isValid: boolean;
  sanitizedInput?: string;
  errors: string[];
}

export class InputValidator {
  private readonly maxInputLength = ${config.maxContextLength};

  /**
   * Validate and sanitize user input
   */
  validate(input: string): ValidationResult {
    const errors: string[] = [];
    let sanitized = input;

    // Check if input is empty
    if (!input || input.trim().length === 0) {
      errors.push('Input cannot be empty');
      return { isValid: false, errors };
    }

    // Check length
    if (input.length > this.maxInputLength) {
      errors.push(\`Input exceeds maximum length of \${this.maxInputLength} characters\`);
      return { isValid: false, errors };
    }

    ${config.inputSanitization ? `
    // Sanitize HTML/Script tags
    sanitized = this.sanitizeHTML(sanitized);

    // Remove control characters
    sanitized = this.removeControlCharacters(sanitized);
    ` : ''}

    ${config.promptInjectionProtection ? `
    // Check for injection attempts
    if (this.hasInjectionAttempt(input)) {
      errors.push('Potential injection attempt detected');
      return { isValid: false, errors };
    }
    ` : ''}

    return {
      isValid: errors.length === 0,
      sanitizedInput: sanitized,
      errors,
    };
  }

  ${config.inputSanitization ? `
  private sanitizeHTML(input: string): string {
    return input
      .replace(/<script[^>]*>.*?<\\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/javascript:/gi, '');
  }

  private removeControlCharacters(input: string): string {
    return input.replace(/[\\x00-\\x1F\\x7F]/g, '');
  }
  ` : ''}

  ${config.promptInjectionProtection ? `
  private hasInjectionAttempt(input: string): boolean {
    const patterns = [
      /ignore (previous|above) (instructions|prompt)/i,
      /system[:\\s]*prompt/i,
      /\\bAI\\b.*\\bignore/i,
      /override.*safety/i,
    ];

    return patterns.some(pattern => pattern.test(input));
  }
  ` : ''}
}

export const inputValidator = new InputValidator();
`;
}

function generateRateLimiter(config: SafetyRailsConfig): string {
  return `/**
 * Rate Limiter
 * Prevents abuse by limiting request frequency
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly requestsPerMinute = ${config.requestsPerMinute};
  private readonly windowMs = 60000; // 1 minute

  /**
   * Check if request is allowed
   */
  checkLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = this.limits.get(userId);

    // No previous requests or window expired
    if (!entry || now >= entry.resetTime) {
      this.limits.set(userId, {
        count: 1,
        resetTime: now + this.windowMs,
      });

      return {
        allowed: true,
        remaining: this.requestsPerMinute - 1,
        resetIn: this.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.requestsPerMinute) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: entry.resetTime - now,
      };
    }

    // Increment count
    entry.count++;
    this.limits.set(userId, entry);

    return {
      allowed: true,
      remaining: this.requestsPerMinute - entry.count,
      resetIn: entry.resetTime - now,
    };
  }

  /**
   * Reset limit for user (admin function)
   */
  resetLimit(userId: string): void {
    this.limits.delete(userId);
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [userId, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(userId);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Auto-cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 300000);
`;
}

function generatePIIDetector(config: SafetyRailsConfig): string {
  return `/**
 * PII Detector
 * Detects and optionally redacts personally identifiable information
 */

export interface PIIMatch {
  type: string;
  value: string;
  start: number;
  end: number;
}

export class PIIDetector {
  private patterns = {
    email: /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g,
    ssn: /\\b\\d{3}-\\d{2}-\\d{4}\\b/g,
    phone: /\\b(?:\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}\\b/g,
    creditCard: /\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b/g,
    ipAddress: /\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b/g,
  };

  /**
   * Detect all PII in text
   */
  detectPII(text: string): PIIMatch[] {
    const matches: PIIMatch[] = [];

    for (const [type, pattern] of Object.entries(this.patterns)) {
      const regex = new RegExp(pattern);
      let match;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          type,
          value: match[0],
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    }

    return matches;
  }

  /**
   * Check if text contains any PII
   */
  containsPII(text: string): boolean {
    return Object.values(this.patterns).some(pattern => pattern.test(text));
  }

  /**
   * Redact PII from text
   */
  redactPII(text: string): string {
    let redacted = text;

    for (const [type, pattern] of Object.entries(this.patterns)) {
      redacted = redacted.replace(pattern, \`[REDACTED_\${type.toUpperCase()}]\`);
    }

    return redacted;
  }
}

export const piiDetector = new PIIDetector();
`;
}

function generateAuditLogger(config: SafetyRailsConfig): string {
  return `/**
 * Audit Logger
 * Logs all LLM interactions for compliance and monitoring
 */

export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  action: string;
  input?: {
    text: string;
    length: number;
  };
  output?: {
    text: string;
    length: number;
  };
  metadata?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
}

export class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private readonly maxLogsInMemory = 1000;

  /**
   * Log an LLM interaction
   */
  log(entry: Omit<AuditLogEntry, 'timestamp'>): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(logEntry);

    // Keep only recent logs in memory
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs.shift();
    }

    // In production, write to persistent storage
    this.persistLog(logEntry);
  }

  /**
   * Log successful request
   */
  logSuccess(userId: string, inputText: string, outputText: string): void {
    this.log({
      userId,
      action: 'llm_completion',
      input: {
        text: inputText.substring(0, 500), // Truncate for storage
        length: inputText.length,
      },
      output: {
        text: outputText.substring(0, 500),
        length: outputText.length,
      },
      success: true,
    });
  }

  /**
   * Log failed request
   */
  logFailure(userId: string, inputText: string, errorMessage: string): void {
    this.log({
      userId,
      action: 'llm_completion_failed',
      input: {
        text: inputText.substring(0, 500),
        length: inputText.length,
      },
      success: false,
      errorMessage,
    });
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100): AuditLogEntry[] {
    return this.logs.slice(-count);
  }

  ${config.gdprCompliance ? `
  /**
   * Delete all logs for a user (GDPR right to erasure)
   */
  deleteUserLogs(userId: string): number {
    const beforeCount = this.logs.length;
    this.logs = this.logs.filter(log => log.userId !== userId);
    return beforeCount - this.logs.length;
  }
  ` : ''}

  private persistLog(entry: AuditLogEntry): void {
    // In production, write to database or file
    // For now, just console log
    console.log('[AUDIT]', JSON.stringify(entry));
  }
}

export const auditLogger = new AuditLogger();
`;
}

function generateExpressMiddleware(config: SafetyRailsConfig): string {
  return `/**
 * Express Middleware for Safety Rails
 * Integrates all safety checks into Express applications
 */

import { Request, Response, NextFunction } from 'express';
import { safetyRails } from '../safety-rails';
${config.rateLimiting ? "import { rateLimiter } from '../rate-limiter';" : ''}
${config.piiDetection ? "import { piiDetector } from '../pii-detector';" : ''}
${config.auditLogging ? "import { auditLogger } from '../audit-logger';" : ''}

/**
 * Main safety middleware
 */
export async function safetyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.headers['x-user-id'] as string || req.ip || 'anonymous';
  const inputText = req.body?.prompt || req.body?.input || req.body?.message || '';

  ${config.rateLimiting ? `
  // Rate limiting
  const rateCheck = rateLimiter.checkLimit(userId);
  if (!rateCheck.allowed) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil(rateCheck.resetIn / 1000),
    });
    return;
  }

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', '${config.requestsPerMinute}');
  res.setHeader('X-RateLimit-Remaining', rateCheck.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateCheck.resetIn).toISOString());
  ` : ''}

  // Validate input
  try {
    const validation = await safetyRails.validateInput(inputText, userId);

    if (!validation.isValid) {
      ${config.auditLogging ? `
      auditLogger.logFailure(userId, inputText, validation.error || 'Safety check failed');
      ` : ''}

      res.status(400).json({
        error: 'Safety check failed',
        message: validation.error,
      });
      return;
    }

    // Store user ID for downstream use
    req.userId = userId;

    next();
  } catch (error) {
    console.error('[Safety Middleware] Error:', error);
    res.status(500).json({
      error: 'Internal safety check error',
    });
  }
}

/**
 * Response validation middleware
 */
export function validateResponseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    const outputText = data?.response || data?.output || data?.message || '';

    ${config.outputValidation ? `
    // Validate output doesn't contain harmful content
    const validation = safetyRails.validateInput(outputText, req.userId || 'system');
    if (!validation.isValid) {
      return originalJson({
        error: 'Generated content failed safety checks',
        message: 'The AI response was filtered for safety reasons',
      });
    }
    ` : ''}

    ${config.piiDetection ? `
    // Redact any PII in output
    if (piiDetector.containsPII(outputText)) {
      if (typeof data === 'object') {
        data.response = piiDetector.redactPII(data.response || '');
        data.output = piiDetector.redactPII(data.output || '');
        data.message = piiDetector.redactPII(data.message || '');
      }
    }
    ` : ''}

    ${config.auditLogging ? `
    // Log successful interaction
    auditLogger.logSuccess(req.userId || 'anonymous', req.body?.prompt || '', outputText);
    ` : ''}

    return originalJson(data);
  };

  next();
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
`;
}

function generateReadme(config: SafetyRailsConfig): string {
  return `# Safety Rails Implementation

Auto-generated safety rails for your LLM application.

## 📦 Generated Files

This package includes:

- \`safety-config.json\` - Configuration settings
- \`safety-rails.ts\` - Main TypeScript implementation
- \`safety_rails.py\` - Python implementation
- \`content-filter.ts\` - Content filtering logic
- \`input-validator.ts\` - Input validation
${config.rateLimiting ? '- `rate-limiter.ts` - Rate limiting\n' : ''}${config.piiDetection ? '- `pii-detector.ts` - PII detection/redaction\n' : ''}${config.auditLogging ? '- `audit-logger.ts` - Audit logging\n' : ''}
- \`middleware/safety-middleware.ts\` - Express middleware

## 🚀 Quick Start

### TypeScript/Node.js

\`\`\`typescript
import { safetyRails } from './safety-rails';

// Validate user input
const result = await safetyRails.validateInput(userInput, userId);

if (!result.isValid) {
  console.error('Safety check failed:', result.error);
  return;
}

// Proceed with LLM call
const response = await callLLM(userInput);
\`\`\`

### Express Integration

\`\`\`typescript
import express from 'express';
import { safetyMiddleware, validateResponseMiddleware } from './middleware/safety-middleware';

const app = express();

// Apply safety middleware
app.use(express.json());
app.use(safetyMiddleware);
app.use(validateResponseMiddleware);

app.post('/api/chat', async (req, res) => {
  // Your LLM logic here - safety is already enforced
  const response = await generateResponse(req.body.prompt);
  res.json({ response });
});
\`\`\`

### Python

\`\`\`python
from safety_rails import SafetyRails

rails = SafetyRails()

# Validate input
is_valid, error = rails.validate_input(user_input, user_id="user123")

if not is_valid:
    print(f"Safety check failed: {error}")
    return

# Proceed with LLM call
response = call_llm(user_input)
\`\`\`

## 🛡️ Enabled Features

${config.contentFiltering ? '✅ Content Filtering\n' : ''}${config.inputSanitization ? '✅ Input Sanitization\n' : ''}${config.promptInjectionProtection ? '✅ Prompt Injection Protection\n' : ''}${config.jailbreakDetection ? '✅ Jailbreak Detection\n' : ''}${config.rateLimiting ? `✅ Rate Limiting (${config.requestsPerMinute} req/min)\n` : ''}${config.piiDetection ? '✅ PII Detection\n' : ''}${config.auditLogging ? '✅ Audit Logging\n' : ''}${config.outputValidation ? '✅ Output Validation\n' : ''}

## ⚙️ Configuration

All settings are in \`safety-config.json\`. Adjust thresholds as needed:

\`\`\`json
{
  "harmfulContentLevel": ${config.harmfulContentLevel},
  "requestsPerMinute": ${config.requestsPerMinute},
  "maxContextLength": ${config.maxContextLength}
}
\`\`\`

## 📊 Monitoring

${config.auditLogging ? `
All requests are logged for audit purposes. Access logs via:

\`\`\`typescript
import { auditLogger } from './audit-logger';

const recentLogs = auditLogger.getRecentLogs(100);
\`\`\`
` : ''}

## 🔒 Security Best Practices

1. **Review generated code** - Customize thresholds for your use case
2. **Test thoroughly** - Validate with your expected inputs
3. **Monitor logs** - Watch for patterns of abuse
4. **Update regularly** - Regenerate safety rails as needs change
5. **Layer defenses** - Use multiple validation methods

## 📝 Customization

The generated code is fully customizable. Key areas to adjust:

- **Content keywords** - Add domain-specific harmful terms
- **PII patterns** - Add region-specific formats
- **Rate limits** - Adjust per your infrastructure
- **Logging** - Connect to your monitoring system

## 🤝 Support

Generated by ADK Link Safety Rails Generator
Version: 1.0.0
Date: ${new Date().toISOString()}

For issues or customization help, refer to ADK Link documentation.
`;
}
