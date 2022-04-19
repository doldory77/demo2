create table code (
    cd          char(4),
    parent_cd   char(4),
    cd_nm       varchar(50),
    attr1       varchar(50),
    primary key(cd)
) engine=myisam;

insert into code (cd, parent_cd, cd_nm) values ('','','');
insert into code (cd, parent_cd, cd_nm) values ('0100','0000','남여구분');
insert into code (cd, parent_cd, cd_nm) values ('0001','0100','남');
insert into code (cd, parent_cd, cd_nm) values ('0002','0100','여');