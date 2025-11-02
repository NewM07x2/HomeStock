export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 px-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">© {currentYear} HomeStock. All rights reserved.</div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">ヘルプ</a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">お問い合わせ</a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">プライバシーポリシー</a>
        </div>
      </div>
    </footer>
  );
}
