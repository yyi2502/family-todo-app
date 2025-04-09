import SigninForm from "@/components/auth/SigninForm";

export default function Home() {
  return (
    <>
      <div
        className="hero min-h-screen bg-opacity-50"
        style={{
          backgroundImage: "url(/main.png)",
        }}
      >
        <div className="absolute inset-0 bg-white opacity-80"></div>
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">TODOチャレンジ</h1>
            <p className="mb-5">
              ファミリー向けのTODOを、楽しく管理できるアプリです。
              <br />
              <span className="underline">保護者の方</span>
              が会員登録＆ログインしてください。
            </p>
            <SigninForm />
          </div>
        </div>
      </div>
    </>
  );
}
