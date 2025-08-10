export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  tabBar: {
    background: string[];
    active: string;
    inactive: string;
    text: {
      active: string;
      inactive: string;
    };
  };
  button: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  h1: {
    fontSize: number;
    fontWeight: string;
  };
  h2: {
    fontSize: number;
    fontWeight: string;
  };
  h3: {
    fontSize: number;
    fontWeight: string;
  };
  body: {
    fontSize: number;
    fontWeight: string;
  };
  caption: {
    fontSize: number;
    fontWeight: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    small: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    large: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

// Dark Theme
export const darkTheme: Theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#000000',
    surface: '#1a1a1a',
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      disabled: '#52525b',
    },
    tabBar: {
      background: ['rgba(0, 0, 0, 1)', 'rgb(9, 2, 31)', 'rgba(0, 0, 0, 1)'],
      active: '#ffffff',
      inactive: '#748c94',
      text: {
        active: '#ffffff',
        inactive: '#748c94',
      },
    },
    button: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      disabled: '#52525b',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

// Light Theme
export const lightTheme: Theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    tabBar: {
      background: ['#ffffff', '#f1f5f9', '#ffffff'],
      active: '#6366f1',
      inactive: '#64748b',
      text: {
        active: '#6366f1',
        inactive: '#64748b',
      },
    },
    button: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      disabled: '#94a3b8',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

// Default theme
export const defaultTheme = darkTheme;

// Theme presets
export const themes = {
  dark: darkTheme,
  light: lightTheme,
  purple: {
    ...darkTheme,
    colors: {
      ...darkTheme.colors,
      primary: '#8b5cf6',
      secondary: '#a855f7',
      tabBar: {
        background: ['rgba(0, 0, 0, 1)', 'rgb(59, 7, 100)', 'rgba(0, 0, 0, 1)'],
        active: '#8b5cf6',
        inactive: '#a1a1aa',
        text: {
          active: '#8b5cf6',
          inactive: '#a1a1aa',
        },
      },
    },
  },
  blue: {
    ...darkTheme,
    colors: {
      ...darkTheme.colors,
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      tabBar: {
        background: ['rgba(0, 0, 0, 1)', 'rgb(30, 58, 138)', 'rgba(0, 0, 0, 1)'],
        active: '#3b82f6',
        inactive: '#a1a1aa',
        text: {
          active: '#3b82f6',
          inactive: '#a1a1aa',
        },
      },
    },
  },
}; 