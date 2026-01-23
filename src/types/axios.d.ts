import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    __isRefreshRequest?: boolean;
  }
}
