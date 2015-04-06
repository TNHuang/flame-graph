per = (node.total_time/parent_time)*100
global_per = global_per*per/100

json.str node.full_name
json.per per
json.global_per global_per

json.children node.children.each do |child|
	if child.total_time/node.total_time > 0.01
		json.partial! "root/node", {
			node: child.target,
			parent_time: node.total_time*(node.children.length),
			global_per: global_per
		}
	end
end