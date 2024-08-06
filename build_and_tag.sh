docker build -t learny-all:latest .
docker run -v ./learny_vol:/learny_vol -p 8005:8005 --env-file sample.env -t learny-all:latest  
