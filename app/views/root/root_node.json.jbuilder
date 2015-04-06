json.message @code
json.thread_time @thread.total_time
json.str "main thread"
json.per 100
json.global_per 100

active_methods = @thread.methods.select do |m|
	m.total_time/@thread.total_time > 0.01 && m.full_name != "RootController#trace"
end

parent_time = @thread.total_time*active_methods.count

json.children active_methods.each do |m|
	json.partial! 'root/node', {
		node: m,
		parent_time: parent_time,
		global_per: 100
	}

end
