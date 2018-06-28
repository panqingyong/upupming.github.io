#!/bin/bash - 
#===============================================================================
#
#          FILE: server.sh
# 
#         USAGE: ./server.sh 
# 
#   DESCRIPTION: 
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: upupming (https://upupming.site), upupming@gmail.com
#  ORGANIZATION: 
#       CREATED: 04/23/2018 08:29:40 PM
#      REVISION:  ---
#===============================================================================

set -o nounset                              # Treat unset variables as an error

hexo g
(cd public; python -m SimpleHTTPServer 4000)
