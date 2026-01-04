export interface Flashcard {
    id: string;
    deckId: string;
    front: string;
    back: string;
    hint?: string;
    difficulty: FlashcardDifficulty;
    lastReviewed?: Date;
    nextReview?: Date;
    correctCount: number;
    incorrectCount: number;
    streak: number;
}

export interface FlashcardDeck {
    id: string;
    name: string;
    description: string;
    category: string;
    cardCount: number;
    masteredCount: number;
    dueCount: number;
    color: string;
    icon: string;
    lastStudied?: Date;
}

export type FlashcardDifficulty = "new" | "learning" | "review" | "mastered";

export interface StudySession {
    deckId: string;
    cardsStudied: number;
    correctAnswers: number;
    startTime: Date;
    endTime?: Date;
}

export type StudyRating = "again" | "hard" | "good" | "easy";
