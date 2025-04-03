import SigninForm from "@/components/auth/SigninForm";

export default function Home() {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={
          {
            // backgroundImage: "url(/index-bg.png)",
          }
        }
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">おてつだいアプリ</h1>
            <p className="mb-5">
              ファミリー向けのTODOを、楽しく管理できるアプリです。
              <br />
              まずは
              <span className="underline">保護者の方</span>
              が会員登録をしてください。
            </p>
            <SigninForm />
          </div>
        </div>
      </div>
    </>
  );
}
