interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  optionNext?: any;
}

const fetchAPI = async (url: string, options: FetchOptions = {}) => {
  // Récupération du token d'authentification de l'utilisateur
  try {
    let authToken = "";
    const session = JSON.parse(localStorage.getItem("jpg_fm_session") || "{}");
    if (session) authToken = "Bearer " + session.accessToken;

    // Ajout des en-têtes d'authentification à la requête
    const headers = {
      Authorization: authToken,
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Construction de l'URL de la requête GET avec les paramètres de requête
    if (options.method === "GET" && options.body) {
      const searchParams = new URLSearchParams(options.body);
      url = `${url}?${searchParams}`;
    }

    // Configuration des options de la requête Fetch
    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers,
      body: options.body && JSON.stringify(options.body),
    };

    // Exécution de la requête Fetch
    const response = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + url,
      {
        ...options.optionNext,
        ...fetchOptions,
      }
    );

    const error = handleResponseErrors(response);
    if (error.error) {
      return error;
    }
    const data = await response.json();

    // Renvoi des données de réponse parsées
    return data;
  } catch (error) {
    return error;
  }
};

export default fetchAPI;

interface ErrorResponse {
  error: boolean;
  message: string;
}

function handleResponseErrors(response: Response): ErrorResponse {
  const errorMessages: Record<number, string> = {
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    500: "Internal server error",
  };

  if (response.status in errorMessages) {
    return {
      error: true,
      message: errorMessages[response.status],
    };
  }

  return {
    error: false,
    message: "",
  };
}
