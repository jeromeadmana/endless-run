export const CONFIG = {
    // Physics
    GRAVITY: 1.0,
    JUMP_FORCE: -20,

    // Game Speed
    INITIAL_SPEED: 7,
    MAX_SPEED: 15,
    SPEED_ACCEL: 0.001,

    // Scoring
    SCORE_MULTIPLIER: 0.01,

    // Obstacles
    INITIAL_OBSTACLE_INTERVAL: 1500,
    MIN_OBSTACLE_INTERVAL: 800,
    INTERVAL_DECAY: 50,

    // Aesthetics
    COLORS: {
        CYAN: '#00f3ff',
        MAGENTA: '#ff00ff',
        PURPLE: '#9d00ff',
        GOLD: '#ff9d00',
        BG_SKY: '#050508',
        BG_GROUND: '#1a1a2e'
    },

    // Collision
    HITBOX_MARGIN: 12,

    // Difficulty Settings
    DIFFICULTIES: {
        EASY: {
            MAX_SPEED: 15,
            SPEED_ACCEL: 0.001,
            MIN_OBSTACLE_INTERVAL: 850
        },
        MEDIUM: {
            MAX_SPEED: 22,
            SPEED_ACCEL: 0.0018,
            MIN_OBSTACLE_INTERVAL: 700
        },
        HARD: {
            MAX_SPEED: 30,
            SPEED_ACCEL: 0.0025,
            MIN_OBSTACLE_INTERVAL: 550
        }
    }
};
