echo "Usage: ffmpeg-webm.sh input.mp4 output.webm"

ffmpeg -i $1 -b:v 0 -crf 60 -pass 1 -an -f webm -y /dev/null
ffmpeg -i $1 -b:v 0 -crf 60 -pass 2 $2
