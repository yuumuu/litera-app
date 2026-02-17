export interface User {
    id: number;
    name: string;
    email?: string;
    role: "admin" | "teacher" | "student" | "guest";
    avatar?: string;
    total_xp?: number;
    level?: number;
    completed_materials?: number;
}

export interface Material {
    id: number;
    title: string;
    slug: string;
    description?: string;
    cover_image?: string;
    ai_status: 'pending' | 'processing' | 'completed' | 'failed';
    difficulty_level?: number | string;
    estimated_duration?: number;
    chapters: Chapter[];
    questions?: Question[];
    attempt_count?: number;
    average_score?: number;
}

export interface Chapter {
    id: number;
    title: string;
    content: string;
    order_number: number;
}

export interface Question {
    id: number;
    question_text: string;
    answers: Answer[];
}

export interface Answer {
    id: number;
    answer_text: string;
}

export interface Attempt {
    id: number;
    material_id: number;
    status: 'in_progress' | 'completed' | 'passed' | 'failed' | 'abandoned';
    percentage: number;
    xp_earned?: number;
    rank?: number;
    badges?: Badge[];
}

export interface Badge {
    id: number;
    name: string;
    icon?: string;
}

export interface TeacherStats {
    total_materials: number;
    total_students: number;
    total_attempts: number;
    average_score: number;
}
