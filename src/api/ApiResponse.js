class ApiResponse {
  constructor(status, url, method, data) {
    this.status = status;
    this.url = url;
    this.method = method
    this.result = data;
  }
}

export default ApiResponse;