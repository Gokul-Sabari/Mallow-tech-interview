import apiConfig from "../config/apiConfig";

interface FetchLinkParams {
  address: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  bodyData?: Record<string, any> | FormData | null | any[] | any;
  others?: RequestInit;
  autoHeaders?: boolean;
  loadingOn?: () => void;
  loadingOff?: () => void;
}

export interface ApiResponse<T = any> {
  total_pages: any;
  totalPages: any;
  page: any;
  errors: any;
  success: boolean;
  data: T[];
  message: string;
  others?: Record<string, any>;
}

export const fetchLink = async <T = any>({
  address,
  method = "GET",
  headers = {},
  bodyData = null,
  others = {},
  autoHeaders = false,
  loadingOn,
  loadingOff,
}: FetchLinkParams): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem("token");
  const isFormData = bodyData instanceof FormData;

 
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    "x-api-key": apiConfig.API_KEY,
  };


  const finalHeaders = autoHeaders
    ? defaultHeaders
    : { ...defaultHeaders, ...headers };


  if (isFormData) delete finalHeaders["Content-Type"];

  const options: RequestInit = {
    method,
    headers: finalHeaders,
    ...others,
  };

  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    options.body = isFormData ? bodyData : JSON.stringify(bodyData || {});
  }

  try {
    loadingOn?.();

    const res = await fetch(apiConfig.BASE_URL + address.replace(/\s+/g, ""), options);


    if (res.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
      return null as any;
    }

   
    if ((finalHeaders["Content-Type"] || "").includes("application/json")) {
      return (await res.json()) as ApiResponse<T>;
    }

  
    return res as unknown as ApiResponse<T>;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    throw err;
  } finally {
    loadingOff?.();
  }
};
