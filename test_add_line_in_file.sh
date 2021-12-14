vf=VERSION.txt
gf=.gitignore

if [[  $(grep ^${vf}$  $gf) ]];
then echo "${vf} has added into ${gf}";
else
echo "\n# add file of ${vf} in case for REDUNDANT changes being detected by IDE
${vf}\n" >> ${gf}
    echo "added line of ${vf} into ${gf}"
fi

