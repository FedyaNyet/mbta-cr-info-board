import request from "request";

export const isEmpty = (t:any) => {
  for (const k in t){
    return false;
  }
  return true;
}

export const getJson = (url:string, onSuccess: (data:any[]) => void) => {
  request(url, (error, response, body)=> {
    if (!error && response.statusCode === 200) {
      let data:any[] = JSON.parse(body).data;
      onSuccess(data);
    } else {
      console.log("Got an error: ", error, ", status code: ", response.statusCode)
    }
  });
}