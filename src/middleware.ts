import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // 1. Xử lý route đăng nhập
  if (pathname.startsWith('/auth/signIn')) {
    if (token) {
      // Chuyển hướng thẳng đến trang mặc định của role
      const redirectPath = token.role === 'QUẢN LÝ' 
        ? '/manager/dashboard' 
        : '/employee/drinks';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  // 2. Xử lý route root
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signIn', request.url));
    } else {
      // Chuyển hướng thẳng đến trang mặc định
      const homePath = token.role === 'QUẢN LÝ' 
        ? '/manager/dashboard' 
        : '/employee/drinks';
      return NextResponse.redirect(new URL(homePath, request.url));
    }
  }

  // 3. Kiểm tra đăng nhập cho các route protected
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signIn', request.url));
  }

  const role = token.role;
  
  // 4. Chuyển hướng các URL chung chung (/employee, /manager) về trang cụ thể
  if (pathname === '/employee') {
    return NextResponse.redirect(new URL('/employee/drinks', request.url));
  }
  
  if (pathname === '/manager') {
    return NextResponse.redirect(new URL('/manager/dashboard', request.url));
  }

  // 5. Kiểm tra phân quyền và chuyển hướng URL sai
  if (role === 'NHÂN VIÊN') {
    // Chuyển hướng tất cả /manager* về trang nhân viên
    if (pathname.startsWith('/manager')) {
      return NextResponse.redirect(new URL('/employee/drinks', request.url));
    }
    
    // Chuyển hướng /employee về trang drinks (nếu cần)
    if (pathname === '/employee') {
      return NextResponse.redirect(new URL('/employee/drinks', request.url));
    }
  }

  if (role === 'QUẢN LÝ') {
    // Chuyển hướng tất cả /employee* về trang quản lý
    if (pathname.startsWith('/employee')) {
      return NextResponse.redirect(new URL('/manager/dashboard', request.url));
    }
    
    // Chuyển hướng /manager về trang dashboard (nếu cần)
    if (pathname === '/manager') {
      return NextResponse.redirect(new URL('/manager/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/manager',
    '/manager/:path*',
    '/employee',
    '/employee/:path*',
    '/auth/signIn'
  ],
};