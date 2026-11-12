import { SignInForm } from '../../components/sign-in-form';
export default async function CustomerPortalPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams;
  return <SignInForm initialReference={typeof params.ref === 'string' ? params.ref.slice(0, 64) : ''} />;
}
