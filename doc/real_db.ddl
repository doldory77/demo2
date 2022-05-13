select * from information_schema.table_constraints where table_schema='www' and table_name='code';

/**********************************/
/* Table Name: 코드 */
/**********************************/
CREATE TABLE code(
		cd                            		CHAR(4)		 NULL  COMMENT '코드',
		parent_cd                     		CHAR(4)		 NULL  COMMENT '부모코드',
		cd_nm                         		VARCHAR(50)		 NULL  COMMENT '코드명',
		ord_no                        		TINYINT(4)		 DEFAULT 0		 NULL  COMMENT '정렬순번',
		attr1                         		VARCHAR(50)		 NULL  COMMENT '속성1'
) COMMENT='코드';

/**********************************/
/* Table Name: 메뉴 */
/**********************************/
CREATE TABLE menu(
		menu_cd                       		CHAR(4)		 NULL  COMMENT '메뉴코드',
		parent_menu_cd                		CHAR(4)		 NULL  COMMENT '부모메뉴코드',
		menu_nm                       		VARCHAR(50)		 NULL  COMMENT '메뉴명',
		url                           		VARCHAR(80)		 NULL  COMMENT '웹경로',
		level                         		TINYINT(1)		 NULL  COMMENT '레벨',
		ord_no                        		TINYINT(4)		 DEFAULT 0		 NULL  COMMENT '정렬순번',
		attr1                         		VARCHAR(50)		 NULL  COMMENT '속성1'
) COMMENT='메뉴';

/**********************************/
/* Table Name: 회원(성도) */
/**********************************/
CREATE TABLE member(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		id                            		VARCHAR(30)		 NULL  COMMENT '아이디',
		name                          		VARCHAR(20)		 NOT NULL COMMENT '이름',
		passwd                        		VARCHAR(80)		 NOT NULL COMMENT '비밀번호',
		jikbun_cd                     		CHAR(4)		 NULL  COMMENT '직분',
		email                         		VARCHAR(30)		 NULL  COMMENT '이메일',
		reg_dt                        		VARCHAR(8)		 NULL  COMMENT '등록일자',
		del_yn                        		CHAR(1)		 DEFAULT 'N'		 NULL  COMMENT '삭제여부',
		mw_cd                         		CHAR(4)		 NULL  COMMENT '남여구분코드'
) COMMENT='회원(성도)';

/**********************************/
/* Table Name: 교역자 */
/**********************************/
CREATE TABLE pastor(
		mb_seq_no                     		INT(4)		 NULL  COMMENT '회원일련번호',
		kind_cd                       		CHAR(4)		 NULL  COMMENT '교역자유형코드'
) COMMENT='교역자';

/**********************************/
/* Table Name: 미디어(영상) */
/**********************************/
CREATE TABLE media(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		subject                       		VARCHAR(80)		 NULL  COMMENT '제목',
		content                       		TEXT		 NULL  COMMENT '본문',
		event_nm                      		VARCHAR(100)		 NULL  COMMENT '행사이름',
		preacher                      		VARCHAR(20)		 NULL  COMMENT '설교자',
		dt                            		CHAR(14)		 NULL  COMMENT '날짜',
		media_kind_cd                 		CHAR(4)		 NULL  COMMENT '미디어종류코드'
) COMMENT='미디어(영상)';

/**********************************/
/* Table Name: 교회부서 */
/**********************************/
CREATE TABLE church_department(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		church_dept_cd                		CHAR(4)		 NULL  COMMENT '교회부서코드',
		subject                       		VARCHAR(80)		 NULL  COMMENT '표어',
		bible_verse                   		VARCHAR(200)		 NULL  COMMENT '주제성구',
		worship_time                  		VARCHAR(100)		 NULL  COMMENT '예배시간',
		place                         		VARCHAR(60)		 NULL  COMMENT '장소',
		content                       		TEXT		 NULL  COMMENT '내용',
		arrt1                         		VARCHAR(50)		 NULL  COMMENT '속성1',
		attr2                         		VARCHAR(100)		 NULL  COMMENT '속성2',
		attr3                         		VARCHAR(100)		 NULL  COMMENT '속성3'
) COMMENT='교회부서';

/**********************************/
/* Table Name: 게시판 */
/**********************************/
CREATE TABLE board(
		board_no                      		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '게시판번호',
		kind_cd                       		CHAR(4)		 NULL  COMMENT '게시판종류코드',
		subject                       		VARCHAR(80)		 NULL  COMMENT '제목',
		content                       		TEXT		 NULL  COMMENT '내용',
		writer                        		VARCHAR(30)		 NULL  COMMENT '작성자',
		write_dt                      		CHAR(14)		 NULL  COMMENT '작성일',
		view_cnt                      		INT(4)		 NULL  COMMENT '조회수',
		ref_dept_seq_no               		INT(4)		 NULL  COMMENT '관련부서일련번호'
) COMMENT='게시판';

/**********************************/
/* Table Name: 파일(이미지,문서 등) */
/**********************************/
CREATE TABLE file(
		src_tbl_nm                    		VARCHAR(30)		 NOT NULL  COMMENT '소스테이블명',
		rf_key                        		INT(4)		 NOT NULL  COMMENT '키',
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		file_kind_cd                  		CHAR(4)		 NULL  COMMENT '파일유형코드'
) COMMENT='파일(이미지,문서 등)';

/**********************************/
/* Table Name: 주소 */
/**********************************/
CREATE TABLE address(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		mb_seq_no                     		MEDIUMINT(4)		 NULL  COMMENT '회원일련번호',
		id                            		VARCHAR(30)		 NULL  COMMENT '아이디',
		postal_cd                     		VARCHAR(10)		 NULL  COMMENT '우편번호',
		addr                          		VARCHAR(100)		 NULL  COMMENT '주소',
		addr_detail                   		VARCHAR(100)		 NULL  COMMENT '주소상세'
) COMMENT='주소';

/**********************************/
/* Table Name: 연락처 */
/**********************************/
CREATE TABLE contact(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		mb_seq_no                     		MEDIUMINT(4)		 NULL  COMMENT '회원일련번호',
		kind_cd                       		CHAR(4)		 NULL  COMMENT '연락처종류코드',
		contact_no                    		VARCHAR(20)		 NULL  COMMENT '연락번호',
		id                            		VARCHAR(30)		 NULL  COMMENT '아이디'
) COMMENT='연락처';

/**********************************/
/* Table Name: 교회부서구성원 */
/**********************************/
CREATE TABLE church_dept_member(
		mb_seq_no                     		INT(4)		 NULL  COMMENT '회원일련번호',
		dept_seq_no                   		INT(4)		 NULL  COMMENT '부서일련번호',
		role_cd                       		CHAR(4)		 NULL  COMMENT '담당코드'
) COMMENT='교회부서구성원';

/**********************************/
/* Table Name: 교회역사 */
/**********************************/
CREATE TABLE church_history(
		seq_no                        		INT(4)		 NOT NULL  AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		dt                            		CHAR(8)		 NULL  COMMENT '날짜',
		content                       		VARCHAR(300)		 NULL  COMMENT '내용'
) COMMENT='교회역사';

/**********************************/
/* Table Name: 링크 */
/**********************************/
CREATE TABLE link(
		src_tbl_nm                    		VARCHAR(30)		 NULL  COMMENT '소스테이블명',
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		rf_key                        		INT(4)		 NULL  COMMENT '키',
		link_nm                       		VARCHAR(100)		 NULL  COMMENT '링크명',
		link_url                      		VARCHAR(100)		 NULL  COMMENT '링크경로'
) COMMENT='링크';

/**********************************/
/* Table Name: 시스템권한 */
/**********************************/
CREATE TABLE sys_auth(
		mb_seq_no                     		INT(4)		 NULL  COMMENT '회원일련번호',
		attr1                         		VARCHAR(50)		 NULL  COMMENT '속성1',
		attr2                         		VARCHAR(100)		 NULL  COMMENT '속성2'
) COMMENT='시스템권한';


ALTER TABLE code ADD CONSTRAINT IDX_code_PK PRIMARY KEY (cd);

ALTER TABLE menu ADD CONSTRAINT IDX_menu_PK PRIMARY KEY (menu_cd);

ALTER TABLE member ADD CONSTRAINT IDX_member_1 UNIQUE (id);

ALTER TABLE pastor ADD CONSTRAINT IDX_pastor_PK PRIMARY KEY (mb_seq_no);

ALTER TABLE file ADD CONSTRAINT IDX_file_1 UNIQUE (src_tbl_nm, rf_key);

ALTER TABLE church_dept_member ADD CONSTRAINT IDX_church_dept_member_PK PRIMARY KEY (mb_seq_no, dept_seq_no);

ALTER TABLE link ADD CONSTRAINT IDX_link_1 UNIQUE (src_tbl_nm, rf_key);

ALTER TABLE sys_auth ADD CONSTRAINT IDX_sys_auth_PK PRIMARY KEY (mb_seq_no);


/* 코드 */
insert into code (cd, parent_cd, cd_nm) value ('0100', '0000', '교역자유형코드');
insert into code (cd, parent_cd, cd_nm) value ('0101', '0100', '담임목사');
insert into code (cd, parent_cd, cd_nm) value ('0102', '0100', '부담임목사');
insert into code (cd, parent_cd, cd_nm) value ('0103', '0100', '협동목사');
insert into code (cd, parent_cd, cd_nm) value ('0104', '0100', '전도사');
insert into code (cd, parent_cd, cd_nm) value ('0105', '0100', '시무장로');
insert into code (cd, parent_cd, cd_nm) value ('0106', '0100', '직원');
insert into code (cd, parent_cd, cd_nm) value ('0107', '0100', '평신도');

insert into code (cd, parent_cd, cd_nm) value ('0200', '0000', '파일유형코드');
insert into code (cd, parent_cd, cd_nm) value ('0201', '0200', '이미지');
insert into code (cd, parent_cd, cd_nm) value ('0202', '0200', '썸네일');
insert into code (cd, parent_cd, cd_nm) value ('0203', '0200', '문서');
insert into code (cd, parent_cd, cd_nm) value ('0204', '0200', '압축파일');
insert into code (cd, parent_cd, cd_nm) value ('0205', '0200', '기타');

insert into code (cd, parent_cd, cd_nm) value ('0300', '0000', '직분코드');
insert into code (cd, parent_cd, cd_nm) value ('0301', '0300', '장로');
insert into code (cd, parent_cd, cd_nm) value ('0302', '0300', '권사');
insert into code (cd, parent_cd, cd_nm) value ('0303', '0300', '안수집사');
insert into code (cd, parent_cd, cd_nm) value ('0304', '0300', '집사');
insert into code (cd, parent_cd, cd_nm) value ('0305', '0300', '기타');

insert into code (cd, parent_cd, cd_nm) value ('0400', '0000', '연락처종류코드');
insert into code (cd, parent_cd, cd_nm) value ('0401', '0400', '집전화번호');
insert into code (cd, parent_cd, cd_nm) value ('0402', '0400', '직장전화번호');
insert into code (cd, parent_cd, cd_nm) value ('0403', '0400', '핸드폰번호');

insert into code (cd, parent_cd, cd_nm) value ('0500', '0000', '미디어종류코드');
insert into code (cd, parent_cd, cd_nm) value ('0501', '0500', '주일설교');
insert into code (cd, parent_cd, cd_nm) value ('0502', '0500', '특별영상');
insert into code (cd, parent_cd, cd_nm) value ('0503', '0500', '특별집회');
insert into code (cd, parent_cd, cd_nm) value ('0504', '0500', '찬양대');
insert into code (cd, parent_cd, cd_nm) value ('0505', '0500', '주일학교');
insert into code (cd, parent_cd, cd_nm) value ('0506', '0500', '찬양대2');
insert into code (cd, parent_cd, cd_nm) value ('0507', '0500', '주일학교2');

insert into code (cd, parent_cd, cd_nm) value ('0600', '0000', '부서종류코드');
insert into code (cd, parent_cd, cd_nm) value ('0601', '0600', '새신자반');
insert into code (cd, parent_cd, cd_nm) value ('0602', '0600', '찬양대');
insert into code (cd, parent_cd, cd_nm) value ('0603', '0600', '유아부');
insert into code (cd, parent_cd, cd_nm) value ('0604', '0600', '유치부');
insert into code (cd, parent_cd, cd_nm) value ('0605', '0600', '유아유치부');
insert into code (cd, parent_cd, cd_nm) value ('0606', '0600', '유년부');
insert into code (cd, parent_cd, cd_nm) value ('0607', '0600', '초등부');
insert into code (cd, parent_cd, cd_nm) value ('0608', '0600', '소년부');
insert into code (cd, parent_cd, cd_nm) value ('0609', '0600', '어린이부');
insert into code (cd, parent_cd, cd_nm) value ('0610', '0600', '중등부');
insert into code (cd, parent_cd, cd_nm) value ('0611', '0600', '고등부');
insert into code (cd, parent_cd, cd_nm) value ('0612', '0600', '중고등부');
insert into code (cd, parent_cd, cd_nm) value ('0613', '0600', '청소년부');
insert into code (cd, parent_cd, cd_nm) value ('0614', '0600', '청년부');

insert into code (cd, parent_cd, cd_nm) value ('0700', '0000', '부서담당자코드');
insert into code (cd, parent_cd, cd_nm) value ('0701', '0700', '교역자');
insert into code (cd, parent_cd, cd_nm) value ('0702', '0700', '부장');
insert into code (cd, parent_cd, cd_nm) value ('0703', '0700', '교사');
insert into code (cd, parent_cd, cd_nm) value ('0704', '0700', '지휘');
insert into code (cd, parent_cd, cd_nm) value ('0705', '0700', '반주');
insert into code (cd, parent_cd, cd_nm) value ('0706', '0700', '부서원');
insert into code (cd, parent_cd, cd_nm) value ('0707', '0700', '기타');

insert into code (cd, parent_cd, cd_nm) value ('0800', '0000', '게시판종류코드');
insert into code (cd, parent_cd, cd_nm) value ('0801', '0800', '교회소식');
insert into code (cd, parent_cd, cd_nm) value ('0802', '0800', '교회행사');
insert into code (cd, parent_cd, cd_nm) value ('0803', '0800', '주보');
insert into code (cd, parent_cd, cd_nm) value ('0804', '0800', '새가족 소개');
insert into code (cd, parent_cd, cd_nm) value ('0805', '0800', '칼럼');
insert into code (cd, parent_cd, cd_nm) value ('0806', '0800', '부서용');

insert into code (cd, parent_cd, cd_nm) value ('0900', '0000', '남여구분코드');
insert into code (cd, parent_cd, cd_nm) value ('0901', '0900', '남');
insert into code (cd, parent_cd, cd_nm) value ('0902', '0900', '여');

/* 메뉴 */
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0100', '0000', '교회소개');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0101', '0100', '인사말');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0102', '0100', '섬기는 사람들');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0103', '0100', '예배안내');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0104', '0100', '오시는 길');

insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0200', '0000', '교회소식');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0201', '0200', '교회소식');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0202', '0200', '교회행사');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0203', '0200', '새가족 소개');

insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0300', '0000', '교회방송');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0301', '0300', '주일설교');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0302', '0300', '특별영상');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0303', '0300', '찬양대');

insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0400', '0000', '선교와 봉사');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0401', '0400', '선교사역');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0402', '0400', '찬양대');

insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0500', '0000', '교회학교 및 교육');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0501', '0500', '어린이부');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0502', '0500', '청소년부');
insert into menu (menu_cd, parent_menu_cd, menu_nm) values ('0503', '0500', '청년부');


select *
from menu 
where 1=1 
	and parent_menu_cd = '0000' 
order by ord_no;

CREATE TABLE member(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		id                            		VARCHAR(30)		 NULL  COMMENT '아이디',
		name                          		VARCHAR(20)		 NOT NULL COMMENT '이름',
		passwd                        		VARCHAR(80)		 NOT NULL COMMENT '비밀번호',
		jikbun_cd                     		CHAR(4)		 NULL  COMMENT '직분',
		email                         		VARCHAR(30)		 NULL  COMMENT '이메일',
		reg_dt                        		VARCHAR(8)		 NULL  COMMENT '등록일자',
		del_yn                        		CHAR(1)		 DEFAULT 'N'		 NULL  COMMENT '삭제여부',
		mw_cd                         		CHAR(4)		 NULL  COMMENT '남여구분코드'
) COMMENT='회원(성도)';

insert into member (
	id,
	name,
	passwd,
	jikbun_cd,
	mw_cd
) values (
	'doldory',
	'전용재',
	password('1234'),
	'0304',
	'0901'
);

CREATE TABLE contact(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
		mb_seq_no                     		MEDIUMINT(4)		 NULL  COMMENT '회원일련번호',
		kind_cd                       		CHAR(4)		 NULL  COMMENT '연락처종류코드',
		contact_no                    		VARCHAR(20)		 NULL  COMMENT '연락번호',
		id                            		VARCHAR(30)		 NULL  COMMENT '아이디'
) COMMENT='연락처';

select * from member;

select seq_no from member where id = 'x2';


select last_insert_id();

insert into contact (
	mb_seq_no, 
	kind_cd, 
	contact_no
) value (
	#{mb_seq_no}, 
	#{kind_cd},
	#{contact_no}
)

select * from contact

delimiter $$
drop function if exists fun_cd_nm; 
create function fun_cd_nm(
	p_cd char(4)
) returns varchar(50)
begin
	declare return_value varchar(50);
	select cd_nm into return_value from code where cd = p_cd;
	return return_value;
end $$
delimiter ;

delimiter $$
drop function if exists fun_fmt_date; 
create function fun_fmt_date(
	p_date varchar(8)
) returns varchar(10)
begin
	declare return_value varchar(10);
	
	select if(p_date is null, null, concat(substr(p_date, 1, 4),'-',substr(p_date, 5, 2),'-',substr(p_date, 7))) into return_value;
	return return_value;
end $$
delimiter ;
