import { Button } from '@/components/ui/button';

const Test = () => {
  return (
    <div className="p-8 space-y-4 bg-gray-50 min-h-screen">
      <Button>기본 버튼</Button>
      <Button variant="outline">아웃라인 버튼</Button>
      <Button variant="ghost">고스트 버튼</Button>
      <Button variant="link">링크 버튼</Button>
      <Button size="sm">작은 버튼</Button>
      <Button size="lg">큰 버튼</Button>
      <Button size="icon">🔍</Button>
    </div>
  );
};

export default Test;
