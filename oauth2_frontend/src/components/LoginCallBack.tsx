import { useSearchParams } from "react-router-dom"
export default function LoginCallBack() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    console.log("Token from callback:", token);
  return (
    <div>
      <h1>Login CallBack Page</h1>
    </div>
  )
}