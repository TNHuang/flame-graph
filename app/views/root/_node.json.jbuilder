per = (node.total_time/parent_time)*100
global_per = global_per*per/100

json.str node.full_name
json.per per
json.global_per global_per

active_methods = node.children.select do |child|
	child.total_time/node.total_time > 0.01
end

parent_time = node.total_time*active_methods.count

json.children active_methods.each do |child|
	json.partial! "root/node", {
		node: child.target,
		parent_time: parent_time,
		global_per: global_per
	}
end