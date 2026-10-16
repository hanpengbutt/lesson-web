import Link from "next/link";

export default function NotFound() {
  return <main className="home-shell error-page"><div>
    <p className="eyebrow">404 · PAGE NOT FOUND</p>
    <h1>교안을 찾을 수 없어요</h1>
    <p>주소를 확인하거나 교안 목록으로 돌아가 주세요.</p>
    <Link href="/">교안 목록으로</Link>
  </div></main>;
}
