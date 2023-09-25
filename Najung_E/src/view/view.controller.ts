import { Controller, Get, Render, Req, Query } from '@nestjs/common';
import { IRequest } from 'src/_common/interfaces/request.interface';
import { ViewService } from 'src/view/view.service';
import { IView } from '../_common/interfaces/view.interface';

@Controller()
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get()
  @Render('main/index.ejs')
  index(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '메인', payload);
  }

  @Get('login')
  @Render('main/login.ejs')
  login(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '로그인', payload);
  }

  @Get('signup')
  @Render('main/signup.ejs')
  signup(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '회원가입', payload);
  }

  @Get('admins/category')
  @Render('admin/category-manage.ejs')
  category(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '카테고리 관리', payload);
  }

  @Get('admins/category/add')
  @Render('admin/category-add.ejs')
  categoryAdd(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '카테고리 추가', payload);
  }

  @Get('admins/category/edit')
  @Render('admin/category-edit.ejs')
  categoryEdit(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '카테고리 수정', payload);
  }

  @Get('admins/category/delete')
  @Render('admin/category-delete.ejs')
  categoryDelete(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '카테고리 삭제', payload);
  }

  // 회원관리 => 회원을 member로 지칭
  @Get('admins/member/add')
  @Render('admin/member-add.ejs')
  memberAdd(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '회원 추가', payload);
  }

  @Get('admins/member/edit')
  @Render('admin/member-edit.ejs')
  memberEdit(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '회원 수정', payload);
  }

  @Get('admins/member/delete')
  @Render('admin/member-delete.ejs')
  memberDelete(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '회원 삭제', payload);
  }

  // 게시판 관리
  @Get('admins/board/manage')
  @Render('admin/board-manage.ejs')
  boardAdd(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '게시판 추가', payload);
  }

  // 게시판
  @Get('board')
  @Render('main/board.ejs')
  loadBoard(@Req() req: IRequest, @Query('boardId') boardId: number): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '게시판', payload);
  }

  // 게시물작성
  @Get('document-write')
  @Render('main/document-write.ejs')
  documentWrite(@Req() req: IRequest, @Query('boardId') boardId: number): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '게시물 작성', payload);
  }
  // 게시물 상세
  @Get('document')
  @Render('main/document-detail.ejs')
  documentDetail(@Req() req: IRequest, @Query('id') id: number): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '게시물 상세', payload);
  }

  // 상품 추가 페이지
  @Get('mypage/products/new')
  @Render('main/product-new.ejs')
  addProduct(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '상품 추가', payload);
  }

  @Get('pick')
  @Render('main/pick.ejs')
  pick(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '찜목록', payload);
  }

  @Get('myprofile')
  @Render('main/myprofile.ejs')
  memberGet(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '프로필', payload);
  }

  @Get('my-products')
  @Render('main/my-products.ejs')
  getMyProducts(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '내 상품', payload);
  }

  @Get('product/:id')
  @Render('main/product-detail.ejs')
  getProductDetail(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '상품 상세', payload);
  }

  @Get('product/:id/edit')
  @Render('main/product-edit.ejs')
  getProductEdit(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '상품 수정', payload);
  }

  @Get('search')
  @Render('main/search.ejs')
  async search(@Req() req: IRequest): Promise<any> {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '검색 결과', payload);
  }

  // 메인 대시보드 관리
  @Get('admins/main-dashboard/manage')
  @Render('admin/main-dashboard-manage.ejs')
  mainDash(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '메인 대시보드 관리', payload);
  }

  // 결제 페이지
  @Get('payment/:id')
  @Render('main/payment.ejs')
  payment(@Req() req: IRequest, @Query('id') id: number): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '결제', payload);
  }

  // 구매 내역
  @Get('trade-history')
  @Render('main/trade-history.ejs')
  tradeHistory(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애', '구매내역', payload);
  }

  // 관리자 - 상품 관리
  @Get('admins/product/manage')
  @Render('admin/product-manage.ejs')
  productManage(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '상품 관리', payload);
  }

  // 관리자 - 상품 수정
  @Get('admins/product/:productId/edit')
  @Render('admin/product-edit.ejs')
  productEdit(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '상품 수정', payload);
  }

  // 계좌 관리
  @Get('/account/management')
  @Render('main/account-management.ejs')
  accountManagement(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '계좌 관리', payload);
  }

  // 계좌 등록
  @Get('/account/registration')
  @Render('main/account-registration.ejs')
  accountRegistration(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '계좌 등록', payload);
  }

  // 관리자 - 거래 관리
  @Get('admins/trade/manage')
  @Render('admin/trade-manage.ejs')
  tradeManage(@Req() req: IRequest): IView {
    const payload = req.user;
    return this.viewService.requiredAuth('나중애 관리자', '거래 관리', payload);
  }
}
