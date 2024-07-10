import { auth, signIn, signOut } from '@/lib/auth';
import { Button } from '@nextui-org/react';
import Image from 'next/image';

export async function User() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <form
        action={async () => {
          'use server';
          await signIn('credentials');
        }}
      >
        <Button variant="light">Log in</Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button variant="light">Logout</Button>
      </form>
      <Image
        className="h-8 w-8 rounded-full"
        src={user.image!}
        height={32}
        width={32}
        alt={`${user.name} avatar`}
      />
    </div>
  );
}
