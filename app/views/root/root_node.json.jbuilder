json.message @code
json.thread_time @thread.total_time
json.str "main thread"
json.per 100
json.global_per 100

active_methods = @thread.methods.select do |m|
	m.total_time/@thread.total_time > 0.01
end

parent_time = @thread.total_time

json.children active_methods.each do |m|
	if m.total_time/@thread.total_time > 0.01
		json.partial! 'root/node', {
			node: m,
			parent_time: parent_time,
			global_per: 100
		}
	end
end
