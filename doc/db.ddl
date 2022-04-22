/**********************************/
/* Table Name: 코드 */
/**********************************/
CREATE TABLE code(
		cd                            		CHAR(4)		 NULL  COMMENT '코드',
		parent_cd                     		CHAR(4)		 NULL  COMMENT '부모코드',
		cd_nm                         		VARCHAR(50)		 NULL  COMMENT '코드명',
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
		attr1                         		VARCHAR(50)		 NULL  COMMENT '속성1'
) COMMENT='메뉴';

/**********************************/
/* Table Name: 회원(성도) */
/**********************************/
CREATE TABLE member(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT COMMENT '일련번호',
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
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT COMMENT '일련번호',
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
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT COMMENT '일련번호',
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
		board_no                      		INT(4)		 NOT NULL AUTO_INCREMENT COMMENT '게시판번호',
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
		src_tbl_nm                    		VARCHAR(30)		 NULL  COMMENT '소스테이블명',
		rf_key                        		INT(4)		 NULL  COMMENT '키',
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT COMMENT '일련번호',
		file_kind_cd                  		CHAR(4)		 NULL  COMMENT '파일유형코드'
) COMMENT='파일(이미지,문서 등)';

/**********************************/
/* Table Name: 주소 */
/**********************************/
CREATE TABLE address(
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT COMMENT '일련번호',
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
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT COMMENT '일련번호',
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
		seq_no                        		INT(4)		 NULL  AUTO_INCREMENT COMMENT '일련번호',
		dt                            		MEDIUMINT(8)		 NULL  COMMENT '날짜',
		content                       		VARCHAR(300)		 NULL  COMMENT '내용'
) COMMENT='교회역사';

/**********************************/
/* Table Name: 링크 */
/**********************************/
CREATE TABLE link(
		src_tbl_nm                    		VARCHAR(30)		 NULL  COMMENT '소스테이블명',
		seq_no                        		INT(4)		 NOT NULL AUTO_INCREMENT COMMENT '일련번호',
		rf_key                        		INT(4)		 NULL  COMMENT '키',
		link_nm                       		VARCHAR(100)		 NULL  COMMENT '링크명',
		link_url                      		VARCHAR(100)		 NULL  COMMENT '링크경로'
) COMMENT='링크';


ALTER TABLE code ADD CONSTRAINT IDX_code_PK PRIMARY KEY (cd);

ALTER TABLE menu ADD CONSTRAINT IDX_menu_PK PRIMARY KEY (menu_cd);

ALTER TABLE member ADD CONSTRAINT IDX_member_PK PRIMARY KEY (seq_no);
ALTER TABLE member ADD CONSTRAINT IDX_member_1 UNIQUE (id);

ALTER TABLE pastor ADD CONSTRAINT IDX_pastor_PK PRIMARY KEY (mb_seq_no);
ALTER TABLE pastor ADD CONSTRAINT IDX_pastor_FK0 FOREIGN KEY (kind_cd) REFERENCES code (cd);
ALTER TABLE pastor ADD CONSTRAINT IDX_pastor_FK1 FOREIGN KEY (mb_seq_no) REFERENCES member (seq_no);

ALTER TABLE media ADD CONSTRAINT IDX_media_PK PRIMARY KEY (seq_no);
ALTER TABLE media ADD CONSTRAINT IDX_media_FK0 FOREIGN KEY (media_kind_cd) REFERENCES code (cd);

ALTER TABLE church_department ADD CONSTRAINT IDX_church_department_PK PRIMARY KEY (seq_no);
ALTER TABLE church_department ADD CONSTRAINT IDX_church_department_FK0 FOREIGN KEY (church_dept_cd) REFERENCES code (cd);

ALTER TABLE board ADD CONSTRAINT IDX_board_PK PRIMARY KEY (board_no);
ALTER TABLE board ADD CONSTRAINT IDX_board_FK0 FOREIGN KEY (ref_dept_seq_no) REFERENCES church_department (seq_no);

ALTER TABLE file ADD CONSTRAINT IDX_file_PK PRIMARY KEY (src_tbl_nm, rf_key, seq_no);
ALTER TABLE file ADD CONSTRAINT IDX_file_FK0 FOREIGN KEY (file_kind_cd) REFERENCES code (cd);
ALTER TABLE file ADD CONSTRAINT IDX_file_FK1 FOREIGN KEY (rf_key) REFERENCES media (seq_no);
ALTER TABLE file ADD CONSTRAINT IDX_file_FK2 FOREIGN KEY (rf_key) REFERENCES church_department (seq_no);
ALTER TABLE file ADD CONSTRAINT IDX_file_FK3 FOREIGN KEY (rf_key) REFERENCES board (board_no);
ALTER TABLE file ADD CONSTRAINT IDX_file_FK4 FOREIGN KEY (rf_key) REFERENCES member (seq_no);

ALTER TABLE address ADD CONSTRAINT IDX_address_PK PRIMARY KEY (seq_no);
ALTER TABLE address ADD CONSTRAINT IDX_address_FK0 FOREIGN KEY (mb_seq_no) REFERENCES member (seq_no);

ALTER TABLE contact ADD CONSTRAINT IDX_contact_PK PRIMARY KEY (seq_no);
ALTER TABLE contact ADD CONSTRAINT IDX_contact_FK0 FOREIGN KEY (kind_cd) REFERENCES code (cd);
ALTER TABLE contact ADD CONSTRAINT IDX_contact_FK1 FOREIGN KEY (mb_seq_no) REFERENCES member (seq_no);

ALTER TABLE church_dept_member ADD CONSTRAINT IDX_church_dept_member_PK PRIMARY KEY (mb_seq_no, dept_seq_no);
ALTER TABLE church_dept_member ADD CONSTRAINT IDX_church_dept_member_FK0 FOREIGN KEY (dept_seq_no) REFERENCES church_department (seq_no);
ALTER TABLE church_dept_member ADD CONSTRAINT IDX_church_dept_member_FK1 FOREIGN KEY (mb_seq_no) REFERENCES member (seq_no);
ALTER TABLE church_dept_member ADD CONSTRAINT IDX_church_dept_member_FK2 FOREIGN KEY (role_cd) REFERENCES code (cd);

ALTER TABLE church_history ADD CONSTRAINT IDX_church_history_PK PRIMARY KEY (seq_no);

ALTER TABLE link ADD CONSTRAINT IDX_link_PK PRIMARY KEY (src_tbl_nm, seq_no, rf_key);
ALTER TABLE link ADD CONSTRAINT IDX_link_FK0 FOREIGN KEY (rf_key) REFERENCES media (seq_no);

