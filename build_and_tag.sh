docker build -t learny-all:latest .
docker run -v ./db_vol:/db_vol -p 8005:8005 -d -t learny-all:latest 


#--env-file <filenameehere>