class EnvConfig {
    static readonly API_URL: string = import.meta.env.VITE_API_URL as string;

    // Якщо потім треба буде додати інші змінні:
    // static readonly APP_NAME: string = import.meta.env.VITE_APP_NAME as string;
}

export default EnvConfig;